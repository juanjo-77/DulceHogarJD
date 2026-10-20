using DulceHogar.Api.Common;
using DulceHogar.Api.Data;
using DulceHogar.Api.Entidades;
using Microsoft.EntityFrameworkCore;

namespace DulceHogar.Api.Features;

public static class DevolucionesEndpoints
{
    public static void MapDevoluciones(this IEndpointRouteBuilder api)
    {
        api.MapGet("/devoluciones", async (AppDb db) =>
        {
            var lista = await db.Devoluciones.Include(d => d.Venta).ThenInclude(v => v!.Cliente)
                .OrderByDescending(d => d.Fecha).Take(200).ToListAsync();
            return lista.Select(d => VentasMapeo.ADevolucion(d, d.Venta?.Cliente));
        }).WithTags("Ventas");

        var g = api.MapGroup("/ventas/{id:int}").WithTags("Ventas");

        g.MapPost("/devoluciones", async (int id, DevolucionInput input, AppDb db, DevolucionServicio servicio, Reloj reloj) =>
        {
            var v = Regla.Existe(await VentasMapeo.CargarAsync(db, id), "la venta");
            Regla.Cumplir(!v.Anulada, "Esta venta fue anulada.");
            Regla.Cumplir(input.Items is { Count: > 0 } && input.Items.Any(i => i.Cantidad > 0), "Elige qué productos te devolvieron.");

            var devueltos = new List<(VentaItem, int)>();
            foreach (var d in input.Items.Where(i => i.Cantidad > 0))
            {
                var item = Regla.Existe(v.Items.FirstOrDefault(i => i.Id == d.VentaItemId), "el producto de la venta");
                var disponibles = item.Cantidad - item.CantidadDevuelta;
                Regla.Cumplir(d.Cantidad <= disponibles, $"De {item.Nombre} solo se pueden devolver {disponibles} unidad(es).");
                devueltos.Add((item, d.Cantidad));
            }

            await servicio.RegistrarAsync(v, devueltos, input.VuelveAlInventario, input.Cambio, input.MontoReembolsado, Texto.Limpiar(input.Motivo));
            await db.SaveChangesAsync();
            return Results.Ok(VentasMapeo.ADetalle(v, reloj.Hoy));
        });

        // Anular = devolver todo al inventario y, si se quiere, devolver el dinero.
        g.MapPost("/anular", async (int id, AnularInput input, AppDb db, DevolucionServicio servicio, Reloj reloj) =>
        {
            var v = Regla.Existe(await VentasMapeo.CargarAsync(db, id), "la venta");
            Regla.Cumplir(!v.Anulada, "Esta venta ya estaba anulada.");
            Regla.Cumplir(input.MontoReembolsado <= Math.Max(v.Pagado, 0),
                $"Solo puedes devolver hasta {Texto.Pesos(Math.Max(v.Pagado, 0))}, que es lo que ha pagado.");

            var pendientes = v.Items.Where(i => i.Cantidad > i.CantidadDevuelta)
                .Select(i => (i, i.Cantidad - i.CantidadDevuelta)).ToList();
            await servicio.RegistrarAsync(v, pendientes, vuelveAlInventario: true, cambio: null,
                input.MontoReembolsado, Texto.Limpiar(input.Motivo) ?? "Venta anulada");
            v.Anulada = true;
            await db.SaveChangesAsync();
            return Results.Ok(VentasMapeo.ADetalle(v, reloj.Hoy));
        });
    }
}
