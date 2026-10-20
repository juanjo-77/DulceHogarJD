using DulceHogar.Api.Common;
using DulceHogar.Api.Data;
using DulceHogar.Api.Entidades;
using Microsoft.EntityFrameworkCore;

namespace DulceHogar.Api.Features;

public static class VentasEndpoints
{
    public static void MapVentas(this IEndpointRouteBuilder api)
    {
        var g = api.MapGroup("/ventas").WithTags("Ventas");

        g.MapGet("", async (TipoVenta? tipo, int? clienteId, DateOnly? desde, DateOnly? hasta, AppDb db, Reloj reloj) =>
        {
            var q = db.Ventas.Include(v => v.Cliente).Include(v => v.Items).AsSplitQuery().AsQueryable();
            if (tipo is { } t) q = q.Where(v => v.Tipo == t);
            if (clienteId is { } c) q = q.Where(v => v.ClienteId == c);
            if (desde is { } d) q = q.Where(v => v.Fecha >= d.ToDateTime(TimeOnly.MinValue));
            if (hasta is { } h) q = q.Where(v => v.Fecha < h.AddDays(1).ToDateTime(TimeOnly.MinValue));
            var ventas = await q.OrderByDescending(v => v.Fecha).Take(300).ToListAsync();
            return ventas.Select(v => VentasMapeo.AResumen(v, reloj.Hoy));
        });

        g.MapGet("/{id:int}", async (int id, AppDb db, Reloj reloj) =>
            Results.Ok(VentasMapeo.ADetalle(Regla.Existe(await VentasMapeo.CargarAsync(db, id), "la venta"), reloj.Hoy)));

        g.MapPost("", async (VentaInput input, VentaServicio ventas, Reloj reloj) =>
            Results.Ok(VentasMapeo.ADetalle(await ventas.CrearAsync(input), reloj.Hoy)));

        // Plan separe: cuando termina de pagar, se le entrega el producto.
        g.MapPost("/{id:int}/entregar", async (int id, AppDb db, Reloj reloj) =>
        {
            var v = Regla.Existe(await VentasMapeo.CargarAsync(db, id), "la venta");
            Regla.Cumplir(!v.Anulada, "Esta venta fue anulada.");
            Regla.Cumplir(!v.Entregada, "Este producto ya fue entregado.");
            Regla.Cumplir(v.Saldo <= 0, $"Todavía debe {Texto.Pesos(v.Saldo)}. Cuando termine de pagar podrás entregarlo.");
            v.Entregada = true;
            v.EntregadaEn = reloj.Ahora;
            await db.SaveChangesAsync();
            return Results.Ok(VentasMapeo.ADetalle(v, reloj.Hoy));
        });

        // Cuentas por cobrar: fiados y planes separe abiertos, lo más urgente primero.
        api.MapGet("/cuentas", async (TipoVenta? tipo, AppDb db, Reloj reloj) =>
        {
            var q = db.Ventas.Include(v => v.Cliente).Include(v => v.Items).Include(v => v.Abonos).AsSplitQuery()
                .Where(v => !v.Anulada && (v.Total > v.Pagado || (v.Tipo == TipoVenta.Separe && !v.Entregada)));
            if (tipo is { } t) q = q.Where(v => v.Tipo == t);
            var hoy = reloj.Hoy;
            return (await q.ToListAsync()).Select(v => VentasMapeo.ACuenta(v, hoy))
                .OrderBy(c => c.Estado switch { EstadoCuenta.Vencida => 0, EstadoCuenta.ParaEntregar => 1, _ => 2 })
                .ThenBy(c => c.FechaLimite ?? DateOnly.MaxValue)
                .ToList();
        }).WithTags("Ventas");
    }
}
