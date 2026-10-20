using DulceHogar.Api.Common;
using DulceHogar.Api.Data;
using DulceHogar.Api.Entidades;
using Microsoft.EntityFrameworkCore;

namespace DulceHogar.Api.Features;

public static class ClientesEndpoints
{
    public static void MapClientes(this IEndpointRouteBuilder api)
    {
        var g = api.MapGroup("/clientes").WithTags("Clientes");

        g.MapGet("", async (string? buscar, bool? soloDeudores, AppDb db) =>
        {
            var q = db.Clientes.Where(c => c.Activo);
            var b = Texto.Normalizar(buscar);
            if (b.Length > 0) q = q.Where(c => c.Busqueda.Contains(b) || (c.Telefono != null && c.Telefono.Contains(b)));
            var lista = await Proyectar(q).ToListAsync();
            return soloDeudores == true ? lista.Where(c => c.Debe > 0).ToList() : lista;
        });

        g.MapGet("/{id:int}", async (int id, AppDb db, Reloj reloj) =>
        {
            var cliente = Regla.Existe(await Proyectar(db.Clientes.Where(c => c.Id == id && c.Activo)).FirstOrDefaultAsync(), "el cliente");
            var ventas = await db.Ventas.Where(v => v.ClienteId == id)
                .Include(v => v.Items).Include(v => v.Abonos).Include(v => v.Cliente)
                .OrderByDescending(v => v.Fecha).AsSplitQuery().ToListAsync();
            var encargos = await EncargosMapeo.Consulta(db)
                .Where(e => e.ClienteId == id && (e.Estado == EstadoEncargo.Pendiente || e.Estado == EstadoEncargo.Listo))
                .OrderBy(e => e.FechaEntrega).ToListAsync();

            var hoy = reloj.Hoy;
            var validas = ventas.Where(v => !v.Anulada).ToList();
            return Results.Ok(new ClienteDetalleDto(
                cliente, validas.Sum(v => v.Total), validas.Count,
                ventas.Where(VentasMapeo.EstaAbierta).Select(v => VentasMapeo.ACuenta(v, hoy)).ToList(),
                ventas.Select(v => VentasMapeo.AResumen(v, hoy)).ToList(),
                encargos.Select(e => EncargosMapeo.ADto(e, hoy, [])).ToList()));
        });

        g.MapPost("", async (ClienteInput input, AppDb db, Reloj reloj) =>
        {
            var c = new Cliente { Nombre = "", CreadoEn = reloj.Ahora };
            await AplicarAsync(c, input, db);
            db.Clientes.Add(c);
            await db.SaveChangesAsync();
            return Results.Ok(await Proyectar(db.Clientes.Where(x => x.Id == c.Id)).FirstAsync());
        });

        g.MapPut("/{id:int}", async (int id, ClienteInput input, AppDb db) =>
        {
            var c = Regla.Existe(await db.Clientes.FirstOrDefaultAsync(x => x.Id == id && x.Activo), "el cliente");
            await AplicarAsync(c, input, db);
            await db.SaveChangesAsync();
            return Results.Ok(await Proyectar(db.Clientes.Where(x => x.Id == c.Id)).FirstAsync());
        });

        g.MapDelete("/{id:int}", async (int id, AppDb db) =>
        {
            var c = Regla.Existe(await db.Clientes.FirstOrDefaultAsync(x => x.Id == id && x.Activo), "el cliente");
            var debe = await db.Ventas.Where(v => v.ClienteId == id && !v.Anulada && v.Total > v.Pagado)
                .SumAsync(v => (long?)(v.Total - v.Pagado)) ?? 0;
            Regla.Cumplir(debe == 0, $"{c.Nombre} todavía debe {Texto.Pesos(debe)}. No se puede borrar mientras tenga deudas.");
            c.Activo = false;
            await db.SaveChangesAsync();
            return Results.NoContent();
        });
    }

    private static IQueryable<ClienteDto> Proyectar(IQueryable<Cliente> q) =>
        q.OrderBy(c => c.Busqueda).Select(c => new ClienteDto(
            c.Id, c.Nombre, c.Telefono, c.Cedula, c.Direccion, c.Notas,
            c.Ventas.Where(v => !v.Anulada && v.Total > v.Pagado).Sum(v => v.Total - v.Pagado),
            c.Ventas.Count(v => !v.Anulada && (v.Total > v.Pagado || (v.Tipo == TipoVenta.Separe && !v.Entregada))),
            c.Ventas.Where(v => !v.Anulada).Max(v => (DateTime?)v.Fecha)));

    private static async Task AplicarAsync(Cliente c, ClienteInput input, AppDb db)
    {
        var nombre = Texto.Limpiar(input.Nombre);
        Regla.Cumplir(nombre is not null, "Escribe el nombre del cliente.");
        var telefono = Texto.SoloDigitos(input.Telefono);
        Regla.Cumplir(telefono is null || telefono.Length is >= 7 and <= 13, "El teléfono no parece correcto. Escríbelo con todos sus números.");

        if (telefono is not null)
        {
            var repetido = await db.Clientes.Where(x => x.Activo && x.Id != c.Id && x.Telefono == telefono)
                .Select(x => x.Nombre).FirstOrDefaultAsync();
            Regla.Cumplir(repetido is null, $"Ese teléfono ya está guardado para {repetido}.");
        }

        c.Nombre = nombre!;
        c.Busqueda = Texto.Normalizar(nombre);
        c.Telefono = telefono;
        c.Cedula = Texto.Limpiar(input.Cedula);
        c.Direccion = Texto.Limpiar(input.Direccion);
        c.Notas = Texto.Limpiar(input.Notas);
    }
}
