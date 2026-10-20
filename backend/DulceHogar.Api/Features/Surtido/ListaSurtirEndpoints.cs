using DulceHogar.Api.Common;
using DulceHogar.Api.Data;
using DulceHogar.Api.Entidades;
using Microsoft.EntityFrameworkCore;

namespace DulceHogar.Api.Features;

/// <summary>La lista de lo que hay que traer cuando vaya a surtir. Cada cambio devuelve la lista completa.</summary>
public static class ListaSurtirEndpoints
{
    public static void MapListaSurtir(this IEndpointRouteBuilder api)
    {
        var g = api.MapGroup("/surtir/lista").WithTags("Surtido");

        g.MapGet("", async (AppDb db) => await ListaAsync(db));

        g.MapPost("", async (PorTraerInput input, AppDb db, Reloj reloj) =>
        {
            var t = new PorTraer { Descripcion = "", CreadoEn = reloj.Ahora };
            await AplicarAsync(t, input, db);
            db.PorTraer.Add(t);
            await db.SaveChangesAsync();
            return await ListaAsync(db);
        });

        g.MapPut("/{id:int}", async (int id, PorTraerInput input, AppDb db) =>
        {
            var t = Regla.Existe(await db.PorTraer.FindAsync(id), "ese renglón de la lista");
            await AplicarAsync(t, input, db);
            await db.SaveChangesAsync();
            return await ListaAsync(db);
        });

        g.MapPost("/{id:int}/conseguido", async (int id, ConseguidoInput input, AppDb db) =>
        {
            var t = Regla.Existe(await db.PorTraer.FindAsync(id), "ese renglón de la lista");
            t.Conseguido = input.Conseguido;
            await db.SaveChangesAsync();
            return await ListaAsync(db);
        });

        g.MapDelete("/{id:int}", async (int id, AppDb db) =>
        {
            await db.PorTraer.Where(t => t.Id == id).ExecuteDeleteAsync();
            return await ListaAsync(db);
        });

        // Anota todo lo que se está acabando y aún no está en la lista (ni pendiente ni ya conseguido).
        g.MapPost("/sugerir", async (AppDb db, Reloj reloj) =>
        {
            var anotados = await db.PorTraer.Where(t => t.ProductoId != null).Select(t => t.ProductoId!.Value).ToListAsync();
            var pocos = await db.Productos.Where(p => p.Activo && p.Stock <= p.StockMinimo && !anotados.Contains(p.Id)).ToListAsync();
            db.PorTraer.AddRange(pocos.Select(p => new PorTraer
            {
                ProductoId = p.Id, Descripcion = p.Nombre, CreadoEn = reloj.Ahora,
                Cantidad = Math.Max(p.StockMinimo * 2 - p.Stock, 1),
                Nota = p.Stock <= 0 ? "Agotado" : $"Quedan {p.Stock}",
            }));
            await db.SaveChangesAsync();
            return new { agregados = pocos.Count, lista = await ListaAsync(db) };
        });
    }

    private static async Task<List<PorTraerDto>> ListaAsync(AppDb db)
    {
        var items = await db.PorTraer.Include(t => t.Producto).ThenInclude(p => p!.Categoria)
            .OrderBy(t => t.Conseguido).ThenBy(t => t.CreadoEn).ToListAsync();
        return items.Select(t => new PorTraerDto(
            t.Id, t.ProductoId, t.Producto?.Nombre ?? t.Descripcion, t.Producto?.Categoria?.Icono, t.Cantidad, t.Conseguido,
            t.Nota, t.Producto?.Stock, t.Producto?.PrecioCompra, t.EncargoId, t.CreadoEn)).ToList();
    }

    private static async Task AplicarAsync(PorTraer t, PorTraerInput input, AppDb db)
    {
        Regla.Cumplir(input.Cantidad > 0, "¿Cuántas unidades vas a traer?");
        if (input.ProductoId is { } pid)
        {
            var p = await ProductosEndpoints.BuscarAsync(db, pid);
            t.ProductoId = p.Id;
            t.Descripcion = p.Nombre;
        }
        else
        {
            var descripcion = Texto.Limpiar(input.Descripcion);
            Regla.Cumplir(descripcion is not null, "Escribe qué vas a traer.");
            t.ProductoId = null;
            t.Descripcion = descripcion!;
        }
        t.Cantidad = input.Cantidad;
        t.Nota = Texto.Limpiar(input.Nota);
    }
}
