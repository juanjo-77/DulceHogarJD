using DulceHogar.Api.Common;
using DulceHogar.Api.Data;
using DulceHogar.Api.Entidades;
using Microsoft.EntityFrameworkCore;
using static DulceHogar.Api.Features.EncargosMapeo;

namespace DulceHogar.Api.Features;

/// <summary>Pedidos de los clientes: lo que alguien pidió y hay que entregarle en una fecha.</summary>
public static class EncargosEndpoints
{
    public static void MapEncargos(this IEndpointRouteBuilder api)
    {
        var g = api.MapGroup("/encargos").WithTags("Pedidos de clientes");

        g.MapGet("", async (bool? todos, AppDb db, Reloj reloj) =>
        {
            var q = Consulta(db);
            if (todos != true) q = q.Where(e => e.Estado == EstadoEncargo.Pendiente || e.Estado == EstadoEncargo.Listo);
            var lista = await q.OrderBy(e => e.FechaEntrega).Take(300).ToListAsync();
            var enLista = await EnListaAsync(db);
            return lista.Select(e => ADto(e, reloj.Hoy, enLista));
        });

        g.MapGet("/{id:int}", async (int id, AppDb db, Reloj reloj) =>
            Results.Ok(ADto(await BuscarAsync(db, id), reloj.Hoy, await EnListaAsync(db))));

        g.MapPost("", async (EncargoInput input, AppDb db, EncargoServicio servicio, Reloj reloj) =>
        {
            var e = new Encargo { CreadoEn = reloj.Ahora, Estado = EstadoEncargo.Pendiente };
            await servicio.AplicarAsync(e, input);
            db.Encargos.Add(e);
            await db.SaveChangesAsync();
            return Results.Ok(ADto(await BuscarAsync(db, e.Id), reloj.Hoy, []));
        });

        g.MapPut("/{id:int}", async (int id, EncargoInput input, AppDb db, EncargoServicio servicio, Reloj reloj) =>
        {
            var e = Regla.Existe(await db.Encargos.Include(x => x.Items).FirstOrDefaultAsync(x => x.Id == id), "el pedido");
            Regla.Cumplir(e.Estado is EstadoEncargo.Pendiente or EstadoEncargo.Listo, "Este pedido ya se cerró y no se puede cambiar.");
            await servicio.AplicarAsync(e, input);
            await db.SaveChangesAsync();
            return Results.Ok(ADto(await BuscarAsync(db, e.Id), reloj.Hoy, await EnListaAsync(db)));
        });

        g.MapPost("/{id:int}/estado", async (int id, EstadoEncargoInput input, AppDb db, Reloj reloj) =>
        {
            var e = await BuscarAsync(db, id);
            Regla.Cumplir(e.VentaId is null, "Este pedido ya se vendió; su estado no se puede cambiar.");
            e.Estado = input.Estado;
            if (input.Estado == EstadoEncargo.Cancelado) await QuitarDeLaListaAsync(db, id);
            await db.SaveChangesAsync();
            return Results.Ok(ADto(e, reloj.Hoy, await EnListaAsync(db)));
        });

        g.MapDelete("/{id:int}", async (int id, AppDb db) =>
        {
            var e = Regla.Existe(await db.Encargos.FindAsync(id), "el pedido");
            Regla.Cumplir(e.VentaId is null, "Este pedido ya se vendió; búscalo en el historial del cliente.");
            await QuitarDeLaListaAsync(db, id);
            db.Encargos.Remove(e);
            await db.SaveChangesAsync();
            return Results.NoContent();
        });

        g.MapPost("/{id:int}/surtir", async (int id, AppDb db, EncargoServicio servicio) =>
            Results.Ok(new { agregados = await servicio.PasarALaListaAsync(await BuscarAsync(db, id)) }));
    }

    private static async Task<Encargo> BuscarAsync(AppDb db, int id) =>
        Regla.Existe(await Consulta(db).FirstOrDefaultAsync(x => x.Id == id), "el pedido");

    private static Task<int> QuitarDeLaListaAsync(AppDb db, int encargoId) =>
        db.PorTraer.Where(t => t.EncargoId == encargoId && !t.Conseguido).ExecuteDeleteAsync();
}
