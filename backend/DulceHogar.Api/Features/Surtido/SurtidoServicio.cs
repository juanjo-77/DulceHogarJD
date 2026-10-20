using DulceHogar.Api.Common;
using DulceHogar.Api.Data;
using DulceHogar.Api.Entidades;
using Microsoft.EntityFrameworkCore;

namespace DulceHogar.Api.Features;

/// <summary>
/// Registra la mercancía que llegó: suma al inventario, crea los productos nuevos
/// y saca de la lista de surtir lo que ya se consiguió.
/// </summary>
public sealed class SurtidoServicio(AppDb db, Reloj reloj)
{
    public async Task<Surtido> RegistrarAsync(SurtidoInput input)
    {
        Regla.Cumplir(input.Items is { Count: > 0 }, "Agrega al menos un producto de lo que llegó.");

        var proveedor = await ProveedorAsync(input);
        var surtido = new Surtido
        {
            Fecha = reloj.Ahora, Proveedor = proveedor, ProveedorNombre = proveedor?.Nombre, Notas = Texto.Limpiar(input.Notas),
        };

        var ids = input.Items.Where(i => i.ProductoId != null).Select(i => i.ProductoId!.Value).ToList();
        var productos = await db.Productos.Where(p => ids.Contains(p.Id) && p.Activo).ToDictionaryAsync(p => p.Id);

        foreach (var i in input.Items)
        {
            Regla.Cumplir(i.Cantidad > 0, "Las cantidades deben ser mayores que cero.");
            Regla.Cumplir(i.CostoUnitario >= 0, "El costo no puede ser negativo.");

            var producto = i.ProductoId is { } pid
                ? Regla.Existe(productos.GetValueOrDefault(pid), "uno de los productos")
                : await CrearProductoAsync(i.Nuevo, i.CostoUnitario);

            producto.Stock += i.Cantidad;
            if (input.ActualizarCosto && i.CostoUnitario > 0) producto.PrecioCompra = i.CostoUnitario;
            surtido.Items.Add(new SurtidoItem { Producto = producto, Nombre = producto.Nombre, Cantidad = i.Cantidad, CostoUnitario = i.CostoUnitario });
        }

        surtido.Total = surtido.Items.Sum(i => i.Cantidad * i.CostoUnitario);
        db.Surtidos.Add(surtido);

        var conseguidos = input.Items.Where(i => i.PorTraerId != null).Select(i => i.PorTraerId!.Value).ToList();
        if (conseguidos.Count > 0)
            db.PorTraer.RemoveRange(await db.PorTraer.Where(t => conseguidos.Contains(t.Id)).ToListAsync());

        await db.SaveChangesAsync();
        return surtido;
    }

    private async Task<Proveedor?> ProveedorAsync(SurtidoInput input)
    {
        if (input.ProveedorId is { } id) return Regla.Existe(await db.Proveedores.FindAsync(id), "el proveedor");

        var nombre = Texto.Limpiar(input.ProveedorNombre);
        if (nombre is null) return null;
        var busqueda = Texto.Normalizar(nombre);
        var existente = await db.Proveedores.FirstOrDefaultAsync(p => p.Busqueda == busqueda);
        if (existente is not null) return existente;

        var nuevo = new Proveedor { Nombre = nombre, Busqueda = busqueda };
        db.Proveedores.Add(nuevo);
        return nuevo;
    }

    private async Task<Producto> CrearProductoAsync(NuevoProductoInput? nuevo, long costo)
    {
        var nombre = Texto.Limpiar(nuevo?.Nombre);
        Regla.Cumplir(nombre is not null, "Elige el producto o escribe el nombre del producto nuevo.");
        Regla.Cumplir(await db.Categorias.AnyAsync(c => c.Id == nuevo!.CategoriaId), $"Elige la categoría de {nombre}.");
        Regla.Cumplir(nuevo!.PrecioVenta > 0, $"Escribe a cuánto vas a vender {nombre}.");

        var p = new Producto
        {
            Nombre = nombre!, Busqueda = Texto.Normalizar(nombre), CategoriaId = nuevo.CategoriaId,
            PrecioVenta = nuevo.PrecioVenta, PrecioCompra = costo, StockMinimo = nuevo.StockMinimo ?? 2, CreadoEn = reloj.Ahora,
        };
        db.Productos.Add(p);
        return p;
    }
}
