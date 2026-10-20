using DulceHogar.Api.Common;
using DulceHogar.Api.Data;
using DulceHogar.Api.Entidades;
using Microsoft.EntityFrameworkCore;

namespace DulceHogar.Api.Features;

public static class VentasMapeo
{
    public static Task<Venta?> CargarAsync(AppDb db, int id) =>
        db.Ventas.Include(v => v.Cliente).Include(v => v.Items).Include(v => v.Abonos).Include(v => v.Devoluciones)
            .AsSplitQuery().FirstOrDefaultAsync(v => v.Id == id);

    public static bool EstaAbierta(Venta v) =>
        !v.Anulada && (v.Saldo > 0 || (v.Tipo == TipoVenta.Separe && !v.Entregada));

    public static ClienteMini? AMini(Cliente? c) => c is null ? null : new(c.Id, c.Nombre, c.Telefono);

    public static string Describir(Venta v) =>
        Texto.Articulos(v.Items.Select(i => (i.Nombre, i.Cantidad - i.CantidadDevuelta)));

    private static int? DiasRestantes(DateOnly? limite, DateOnly hoy) =>
        limite is { } l ? l.DayNumber - hoy.DayNumber : null;

    public static VentaResumenDto AResumen(Venta v, DateOnly hoy) => new(
        v.Id, v.Fecha, v.Tipo, v.Estado(hoy), AMini(v.Cliente), Describir(v),
        v.Total, v.Pagado, v.Saldo, v.FechaLimite, v.Entregada);

    public static CuentaDto ACuenta(Venta v, DateOnly hoy) => new(
        v.Id, v.Tipo, v.Estado(hoy), AMini(v.Cliente), Describir(v), v.Fecha, v.Total, v.Pagado, v.Saldo,
        v.FechaLimite, DiasRestantes(v.FechaLimite, hoy), v.Abonos.Count == 0 ? null : v.Abonos.Max(a => a.Fecha));

    public static VentaDetalleDto ADetalle(Venta v, DateOnly hoy) => new(
        v.Id, v.Fecha, v.Tipo, v.Estado(hoy), AMini(v.Cliente),
        v.Items.OrderBy(i => i.Id).Select(AItem).ToList(),
        v.Abonos.OrderBy(a => a.Fecha).Select(a => new AbonoDto(a.Id, a.Fecha, a.Monto, a.Metodo, a.Nota)).ToList(),
        v.Devoluciones.OrderBy(d => d.Fecha).Select(d => ADevolucion(d, v.Cliente)).ToList(),
        v.Total, v.Pagado, v.Saldo, v.FechaLimite, v.Saldo > 0 ? DiasRestantes(v.FechaLimite, hoy) : null,
        v.Entregada, v.EntregadaEn, v.Anulada, v.Notas, v.EncargoId);

    public static DevolucionDto ADevolucion(Devolucion d, Cliente? c) => new(
        d.Id, d.VentaId, d.Fecha, d.Devuelto, d.Cambio, d.VuelveAlInventario, d.MontoReembolsado, d.Motivo, AMini(c));

    private static VentaItemDto AItem(VentaItem i) => new(
        i.Id, i.ProductoId, i.Nombre, i.Cantidad, i.CantidadDevuelta, i.PrecioUnitario,
        (long)(i.Cantidad - i.CantidadDevuelta) * i.PrecioUnitario);
}
