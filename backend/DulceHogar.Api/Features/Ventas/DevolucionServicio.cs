using DulceHogar.Api.Common;
using DulceHogar.Api.Entidades;

namespace DulceHogar.Api.Features;

/// <summary>
/// Devoluciones y cambios. Todo queda sobre la misma venta: lo devuelto baja el total,
/// lo que se entrega a cambio lo sube, y el saldo se ajusta solo.
/// </summary>
public sealed class DevolucionServicio(InventarioServicio inventario, Reloj reloj)
{
    public async Task RegistrarAsync(
        Venta v, List<(VentaItem Item, int Cantidad)> devueltos, bool vuelveAlInventario,
        List<VentaItemInput>? cambio, long reembolso, string? motivo)
    {
        Regla.Cumplir(reembolso >= 0, "El dinero devuelto no puede ser negativo.");

        var devolucion = new Devolucion
        {
            Fecha = reloj.Ahora,
            Motivo = motivo,
            VuelveAlInventario = vuelveAlInventario,
            Devuelto = Texto.Articulos(devueltos.Select(d => (d.Item.Nombre, d.Cantidad))),
        };

        foreach (var (item, cantidad) in devueltos)
        {
            item.CantidadDevuelta += cantidad;
            devolucion.Items.Add(new DevolucionItem { VentaItemId = item.Id, Cantidad = cantidad });
        }

        // Un plan separe sin entregar nunca salió de la tienda: siempre vuelve al inventario.
        if (vuelveAlInventario || !v.Entregada)
            await inventario.DevolverAsync(devueltos.Select(d => (d.Item.ProductoId, d.Cantidad)));

        if (cambio is { Count: > 0 })
        {
            var nuevos = await inventario.SacarAsync(cambio);
            v.Items.AddRange(nuevos);
            devolucion.Cambio = Texto.Articulos(nuevos.Select(n => (n.Nombre, n.Cantidad)));
        }

        v.Recalcular();
        var aFavor = Math.Max(v.Pagado - v.Total, 0);
        Regla.Cumplir(reembolso <= aFavor, aFavor == 0
            ? "Con esta devolución no hay dinero para devolver."
            : $"Solo puedes devolver hasta {Texto.Pesos(aFavor)}.");

        devolucion.MontoReembolsado = reembolso;
        v.Devoluciones.Add(devolucion);
        v.Recalcular();
    }
}
