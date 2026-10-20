using DulceHogar.Api.Common;
using DulceHogar.Api.Data;
using DulceHogar.Api.Entidades;
using Microsoft.EntityFrameworkCore;

namespace DulceHogar.Api.Features;

public static class CajaEndpoints
{
    public static void MapCaja(this IEndpointRouteBuilder api)
    {
        api.MapGet("/caja", async (DateOnly? fecha, CajaServicio caja, Reloj reloj) =>
        {
            var dia = fecha ?? reloj.Hoy;
            var movimientos = await caja.MovimientosAsync(dia, dia.AddDays(1));
            var entradas = movimientos.Where(m => m.Entrada).ToList();
            var salidas = movimientos.Where(m => !m.Entrada).Sum(m => m.Monto);
            return new CajaDto(
                dia, entradas.Sum(m => m.Monto), salidas, entradas.Sum(m => m.Monto) - salidas,
                entradas.Where(m => m.Metodo == MetodoPago.Efectivo).Sum(m => m.Monto),
                entradas.Where(m => m.Metodo == MetodoPago.Transferencia).Sum(m => m.Monto),
                movimientos);
        }).WithTags("Caja");

        // Gastos del negocio y otros ingresos que no son ventas.
        var g = api.MapGroup("/movimientos").WithTags("Caja");

        g.MapGet("/{id:int}", async (int id, AppDb db) => Results.Ok(Regla.Existe(await db.Movimientos.FindAsync(id), "ese gasto")));

        g.MapPost("", async (MovimientoInput input, AppDb db, Reloj reloj) =>
        {
            var m = new Movimiento { Concepto = "" };
            Aplicar(m, input, reloj);
            db.Movimientos.Add(m);
            await db.SaveChangesAsync();
            return Results.Ok(m);
        });

        g.MapPut("/{id:int}", async (int id, MovimientoInput input, AppDb db, Reloj reloj) =>
        {
            var m = Regla.Existe(await db.Movimientos.FindAsync(id), "ese gasto");
            Aplicar(m, input, reloj);
            await db.SaveChangesAsync();
            return Results.Ok(m);
        });

        g.MapDelete("/{id:int}", async (int id, AppDb db) =>
        {
            await db.Movimientos.Where(m => m.Id == id).ExecuteDeleteAsync();
            return Results.NoContent();
        });
    }

    private static void Aplicar(Movimiento m, MovimientoInput input, Reloj reloj)
    {
        var concepto = Texto.Limpiar(input.Concepto);
        Regla.Cumplir(concepto is not null, input.Tipo == TipoMovimiento.Gasto ? "¿En qué se gastó la plata?" : "¿De dónde entró la plata?");
        Regla.Cumplir(input.Monto > 0, "Escribe el valor.");
        var hoy = reloj.Hoy;
        var dia = input.Fecha ?? hoy;
        Regla.Cumplir(dia <= hoy, "La fecha no puede ser en el futuro.");

        m.Tipo = input.Tipo;
        m.Concepto = concepto!;
        m.Monto = input.Monto;
        m.Nota = Texto.Limpiar(input.Nota);
        // Si es de hoy guarda la hora real; si es de otro día, al mediodía.
        if (DateOnly.FromDateTime(m.Fecha) != dia)
            m.Fecha = dia == hoy ? reloj.Ahora : dia.ToDateTime(new TimeOnly(12, 0));
    }
}
