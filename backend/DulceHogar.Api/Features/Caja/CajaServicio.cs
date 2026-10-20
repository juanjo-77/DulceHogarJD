using DulceHogar.Api.Data;
using DulceHogar.Api.Entidades;
using Microsoft.EntityFrameworkCore;

namespace DulceHogar.Api.Features;

/// <summary>
/// Junta todo el dinero que entró y salió: abonos y ventas de contado, compras de mercancía,
/// gastos, otros ingresos y dinero devuelto a clientes.
/// </summary>
public sealed class CajaServicio(AppDb db)
{
    /// <summary>Movimientos entre dos días; el día <paramref name="hasta"/> no se incluye.</summary>
    public async Task<List<MovimientoDto>> MovimientosAsync(DateOnly desde, DateOnly hasta)
    {
        var inicio = desde.ToDateTime(TimeOnly.MinValue);
        var fin = hasta.ToDateTime(TimeOnly.MinValue);

        var abonos = await db.Abonos.Include(a => a.Venta).ThenInclude(v => v!.Cliente)
            .Where(a => a.Fecha >= inicio && a.Fecha < fin).ToListAsync();
        var surtidos = await db.Surtidos.Where(s => s.Fecha >= inicio && s.Fecha < fin).ToListAsync();
        var manuales = await db.Movimientos.Where(m => m.Fecha >= inicio && m.Fecha < fin).ToListAsync();
        var reembolsos = await db.Devoluciones.Include(d => d.Venta).ThenInclude(v => v!.Cliente)
            .Where(d => d.Fecha >= inicio && d.Fecha < fin && d.MontoReembolsado > 0).ToListAsync();

        return abonos.Select(DeAbono)
            .Concat(surtidos.Select(s => new MovimientoDto(
                $"surtido-{s.Id}", s.Fecha, false, "Surtido",
                s.ProveedorNombre is null ? "Compra de mercancía" : $"Compra a {s.ProveedorNombre}",
                s.Total, null, null, s.Id, null)))
            .Concat(manuales.Select(m => new MovimientoDto(
                $"mov-{m.Id}", m.Fecha, m.Tipo == TipoMovimiento.Ingreso,
                m.Tipo == TipoMovimiento.Gasto ? "Gasto" : "Otro ingreso", m.Concepto, m.Monto, null, null, null, m.Id)))
            .Concat(reembolsos.Select(d => new MovimientoDto(
                $"dev-{d.Id}", d.Fecha, false, "Devolución",
                $"Dinero devuelto a {d.Venta?.Cliente?.Nombre ?? "cliente"}", d.MontoReembolsado, null, d.VentaId, null, null)))
            .OrderByDescending(m => m.Fecha)
            .ToList();
    }

    private static MovimientoDto DeAbono(Abono a)
    {
        var quien = a.Venta!.Cliente?.Nombre;
        var (categoria, concepto) = a.Venta.Tipo switch
        {
            TipoVenta.Contado => ("Venta", quien is null ? "Venta de contado" : $"Venta a {quien}"),
            TipoVenta.Fiado => ("Abono", $"Abono de {quien} (fiado)"),
            _ => ("Abono", $"Abono de {quien} (plan separe)"),
        };
        return new MovimientoDto($"abono-{a.Id}", a.Fecha, true, categoria, concepto, a.Monto, a.Metodo, a.VentaId, null, null);
    }
}
