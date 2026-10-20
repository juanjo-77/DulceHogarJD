using DulceHogar.Api.Common;
using DulceHogar.Api.Data;
using DulceHogar.Api.Entidades;

namespace DulceHogar.Api.Features;

public static class AbonosEndpoints
{
    public static void MapAbonos(this IEndpointRouteBuilder api)
    {
        api.MapPost("/ventas/{id:int}/abonos", async (int id, AbonoInput input, AppDb db, Reloj reloj, ReciboServicio recibos) =>
        {
            var v = Regla.Existe(await VentasMapeo.CargarAsync(db, id), "la venta");
            Regla.Cumplir(!v.Anulada, "Esta venta fue anulada.");
            Regla.Cumplir(input.Monto > 0, "Escribe cuánto abonó.");
            Regla.Cumplir(v.Saldo > 0, "Esta cuenta ya está paga.");
            Regla.Cumplir(input.Monto <= v.Saldo, $"Solo debe {Texto.Pesos(v.Saldo)}. El abono no puede ser mayor.");

            var abono = new Abono { Fecha = reloj.Ahora, Monto = input.Monto, Metodo = input.Metodo, Nota = Texto.Limpiar(input.Nota) };
            v.Abonos.Add(abono);
            v.Recalcular();
            await db.SaveChangesAsync();
            return Results.Ok(await recibos.CrearAsync(abono.Id));
        }).WithTags("Ventas");

        var g = api.MapGroup("/abonos").WithTags("Ventas");

        g.MapGet("/{id:int}/recibo", async (int id, ReciboServicio recibos) => Results.Ok(await recibos.CrearAsync(id)));

        // Para corregir un abono anotado por error.
        g.MapDelete("/{id:int}", async (int id, AppDb db) =>
        {
            var abono = Regla.Existe(await db.Abonos.FindAsync(id), "el abono");
            var v = (await VentasMapeo.CargarAsync(db, abono.VentaId))!;
            Regla.Cumplir(v.Tipo != TipoVenta.Contado, "El pago de una venta de contado no se borra. Si fue un error, anula la venta.");
            Regla.Cumplir(!v.Anulada, "Esta venta fue anulada.");
            Regla.Cumplir(!(v.Tipo == TipoVenta.Separe && v.Entregada), "Este plan separe ya fue entregado; sus abonos no se pueden borrar.");

            v.Abonos.Remove(abono);
            db.Abonos.Remove(abono);
            v.Recalcular();
            await db.SaveChangesAsync();
            return Results.NoContent();
        });
    }
}
