using DulceHogar.Api.Common;
using DulceHogar.Api.Data;
using DulceHogar.Api.Entidades;
using Microsoft.EntityFrameworkCore;

namespace DulceHogar.Api.Features;

/// <summary>Saca productos del inventario al vender (o al entregar un cambio).</summary>
public sealed class InventarioServicio(AppDb db)
{
    /// <summary>Valida que haya unidades, las descuenta y devuelve los renglones de la venta.</summary>
    public async Task<List<VentaItem>> SacarAsync(IEnumerable<VentaItemInput> pedidos)
    {
        var agrupados = pedidos.GroupBy(i => i.ProductoId)
            .Select(g => (ProductoId: g.Key, Cantidad: g.Sum(x => x.Cantidad), Precio: g.First().PrecioUnitario))
            .ToList();
        Regla.Cumplir(agrupados.All(i => i.Cantidad > 0), "Las cantidades deben ser mayores que cero.");

        var ids = agrupados.Select(i => i.ProductoId).ToList();
        var productos = await db.Productos.Where(p => ids.Contains(p.Id) && p.Activo).ToDictionaryAsync(p => p.Id);

        var items = new List<VentaItem>();
        foreach (var (productoId, cantidad, precio) in agrupados)
        {
            var p = Regla.Existe(productos.GetValueOrDefault(productoId), "uno de los productos");
            Regla.Cumplir(p.Stock >= cantidad, p.Stock <= 0
                ? $"{p.Nombre} está agotado."
                : $"De {p.Nombre} solo quedan {p.Stock} unidad(es).");
            Regla.Cumplir(precio is null or > 0, $"El precio de {p.Nombre} debe ser mayor que cero.");

            p.Stock -= cantidad;
            items.Add(new VentaItem
            {
                ProductoId = p.Id, Nombre = p.Nombre, Cantidad = cantidad,
                PrecioUnitario = precio ?? p.PrecioVenta, CostoUnitario = p.PrecioCompra,
            });
        }
        return items;
    }

    public async Task DevolverAsync(IEnumerable<(int ProductoId, int Cantidad)> devueltos)
    {
        var lista = devueltos.ToList();
        var ids = lista.Select(d => d.ProductoId).ToList();
        var productos = await db.Productos.Where(p => ids.Contains(p.Id)).ToDictionaryAsync(p => p.Id);
        foreach (var (productoId, cantidad) in lista)
            if (productos.TryGetValue(productoId, out var p)) p.Stock += cantidad;
    }
}
