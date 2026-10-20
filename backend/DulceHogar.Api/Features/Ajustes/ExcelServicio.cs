using ClosedXML.Excel;
using DulceHogar.Api.Data;
using Microsoft.EntityFrameworkCore;

namespace DulceHogar.Api.Features;

/// <summary>Exporta todo el negocio a un Excel, una hoja por tema.</summary>
public sealed class ExcelServicio(AppDb db)
{
    public async Task<MemoryStream> CrearAsync()
    {
        using var libro = new XLWorkbook();

        var productos = await db.Productos.Include(p => p.Categoria).Where(p => p.Activo).OrderBy(p => p.Busqueda).ToListAsync();
        HojaExcel.Agregar(libro, "Productos", ["Producto", "Categoría", "Precio compra", "Precio venta", "Unidades", "Aviso desde"],
            productos.Select(p => new object?[] { p.Nombre, p.Categoria?.Nombre, p.PrecioCompra, p.PrecioVenta, p.Stock, p.StockMinimo }));

        var clientes = await db.Clientes.Where(c => c.Activo).OrderBy(c => c.Busqueda).ToListAsync();
        HojaExcel.Agregar(libro, "Clientes", ["Nombre", "Teléfono", "Cédula", "Dirección", "Notas"],
            clientes.Select(c => new object?[] { c.Nombre, c.Telefono, c.Cedula, c.Direccion, c.Notas }));

        var ventas = await db.Ventas.Include(v => v.Cliente).Include(v => v.Items).AsSplitQuery().OrderByDescending(v => v.Fecha).ToListAsync();
        HojaExcel.Agregar(libro, "Ventas", ["N°", "Fecha", "Tipo", "Cliente", "Productos", "Total", "Pagado", "Debe", "Fecha límite", "Entregada", "Anulada"],
            ventas.Select(v => new object?[]
            {
                v.Id, v.Fecha, v.Tipo.ToString(), v.Cliente?.Nombre, VentasMapeo.Describir(v), v.Total, v.Pagado, Math.Max(v.Saldo, 0),
                v.FechaLimite?.ToDateTime(TimeOnly.MinValue), v.Entregada ? "Sí" : "No", v.Anulada ? "Sí" : "No",
            }));

        var abonos = await db.Abonos.Include(a => a.Venta).ThenInclude(v => v!.Cliente).OrderByDescending(a => a.Fecha).ToListAsync();
        HojaExcel.Agregar(libro, "Abonos", ["Recibo", "Fecha", "Venta", "Cliente", "Valor", "Forma de pago", "Nota"],
            abonos.Select(a => new object?[] { a.Id, a.Fecha, a.VentaId, a.Venta?.Cliente?.Nombre, a.Monto, a.Metodo.ToString(), a.Nota }));

        var surtidos = await db.Surtidos.Include(s => s.Items).OrderByDescending(s => s.Fecha).ToListAsync();
        HojaExcel.Agregar(libro, "Surtido", ["N°", "Fecha", "Proveedor", "Producto", "Unidades", "Costo unidad", "Subtotal"],
            surtidos.SelectMany(s => s.Items.Select(i => new object?[] { s.Id, s.Fecha, s.ProveedorNombre, i.Nombre, i.Cantidad, i.CostoUnitario, i.Cantidad * i.CostoUnitario })));

        var movimientos = await db.Movimientos.OrderByDescending(m => m.Fecha).ToListAsync();
        HojaExcel.Agregar(libro, "Gastos e ingresos", ["Fecha", "Tipo", "Concepto", "Valor", "Nota"],
            movimientos.Select(m => new object?[] { m.Fecha, m.Tipo.ToString(), m.Concepto, m.Monto, m.Nota }));

        var flujo = new MemoryStream();
        libro.SaveAs(flujo);
        flujo.Position = 0;
        return flujo;
    }
}
