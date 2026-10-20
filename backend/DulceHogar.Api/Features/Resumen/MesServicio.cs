using DulceHogar.Api.Common;
using DulceHogar.Api.Data;
using DulceHogar.Api.Entidades;
using Microsoft.EntityFrameworkCore;

namespace DulceHogar.Api.Features;

/// <summary>Cifras del mes. La ganancia es estimada: lo vendido menos lo que costó esa mercancía y los gastos.</summary>
public sealed record CifrasMes(List<Venta> Ventas, long Vendido, long Costo, long Gastos, long Otros)
{
    public long Ganancia => Vendido - Costo - Gastos + Otros;
}

public sealed class MesServicio(AppDb db, CajaServicio caja, Reloj reloj)
{
    public async Task<MesDto> CrearAsync(int? anio, int? mes)
    {
        var hoy = reloj.Hoy;
        var primero = new DateOnly(anio ?? hoy.Year, mes is >= 1 and <= 12 ? mes.Value : hoy.Month, 1);
        var esActual = primero.Year == hoy.Year && primero.Month == hoy.Month;

        // Seis meses de historia para la gráfica, terminando en el mes elegido.
        var desde = primero.AddMonths(-5).ToDateTime(TimeOnly.MinValue);
        var hasta = primero.AddMonths(1).ToDateTime(TimeOnly.MinValue);
        var ventas = await db.Ventas.Include(v => v.Items)
            .Where(v => !v.Anulada && v.Fecha >= desde && v.Fecha < hasta).ToListAsync();
        var manuales = await db.Movimientos.Where(m => m.Fecha >= desde && m.Fecha < hasta).ToListAsync();

        CifrasMes Cifras(DateOnly inicio)
        {
            bool EnMes(DateTime f) => f.Year == inicio.Year && f.Month == inicio.Month;
            var delMes = ventas.Where(v => EnMes(v.Fecha)).ToList();
            return new CifrasMes(delMes, delMes.Sum(v => v.Total),
                delMes.SelectMany(v => v.Items).Sum(i => (long)(i.Cantidad - i.CantidadDevuelta) * i.CostoUnitario),
                manuales.Where(m => m.Tipo == TipoMovimiento.Gasto && EnMes(m.Fecha)).Sum(m => m.Monto),
                manuales.Where(m => m.Tipo == TipoMovimiento.Ingreso && EnMes(m.Fecha)).Sum(m => m.Monto));
        }

        var actual = Cifras(primero);
        var anterior = Cifras(primero.AddMonths(-1));
        var tendencia = Enumerable.Range(0, 6).Select(i => primero.AddMonths(i - 5)).Select(m =>
        {
            var c = Cifras(m);
            return new MesPuntoDto(m.Year, m.Month, Texto.MesCorto(m.Month), c.Vendido, c.Ganancia);
        }).ToList();

        var movimientos = await caja.MovimientosAsync(primero, primero.AddMonths(1));
        var porCobrar = await db.Ventas.Where(v => !v.Anulada && v.Total > v.Pagado).SumAsync(v => (long?)(v.Total - v.Pagado)) ?? 0;
        var mesAnterior = Texto.NombreMes(primero.AddMonths(-1).Month);
        long PorTipo(TipoVenta t) => actual.Ventas.Where(v => v.Tipo == t).Sum(v => v.Total);

        return new MesDto(
            primero.Year, primero.Month, Texto.NombreMes(primero.Month), esActual,
            actual.Vendido, actual.Ventas.Count, actual.Costo, actual.Vendido - actual.Costo, actual.Gastos, actual.Otros, actual.Ganancia,
            actual.Vendido > 0 ? (int)Math.Round(actual.Ganancia * 100.0 / actual.Vendido) : 0,
            movimientos.Where(m => m.Entrada).Sum(m => m.Monto), movimientos.Where(m => m.Categoria == "Surtido").Sum(m => m.Monto),
            porCobrar, PorTipo(TipoVenta.Contado), PorTipo(TipoVenta.Fiado), PorTipo(TipoVenta.Separe),
            anterior.Ganancia, anterior.Vendido, mesAnterior,
            Veredicto.Crear(actual, anterior, mesAnterior, esActual, porCobrar),
            tendencia, TopProductos(actual.Ventas), movimientos.Where(m => m.Categoria == "Gasto").ToList());
    }

    private static List<TopProductoDto> TopProductos(List<Venta> ventas) =>
        ventas.SelectMany(v => v.Items)
            .GroupBy(i => i.ProductoId)
            .Select(g => new TopProductoDto(g.Key, g.First().Nombre,
                g.Sum(i => i.Cantidad - i.CantidadDevuelta),
                g.Sum(i => (long)(i.Cantidad - i.CantidadDevuelta) * i.PrecioUnitario)))
            .Where(t => t.Unidades > 0)
            .OrderByDescending(t => t.Unidades).ThenByDescending(t => t.Vendido)
            .Take(5).ToList();
}
