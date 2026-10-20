using DulceHogar.Api.Common;
using DulceHogar.Api.Data;
using DulceHogar.Api.Entidades;
using Microsoft.EntityFrameworkCore;
using static DulceHogar.Api.Features.ProductosMapeo;

namespace DulceHogar.Api.Features;

public static class ProductosEndpoints
{
    public static void MapProductos(this IEndpointRouteBuilder api)
    {
        var g = api.MapGroup("/productos").WithTags("Productos");

        g.MapGet("", async (string? buscar, int? categoriaId, string? estado, AppDb db) =>
        {
            var q = db.Productos.Include(p => p.Categoria).Where(p => p.Activo);
            var b = Texto.Normalizar(buscar);
            if (b.Length > 0) q = q.Where(p => p.Busqueda.Contains(b));
            if (categoriaId is { } cid) q = q.Where(p => p.CategoriaId == cid);
            if (estado == "agotados") q = q.Where(p => p.Stock <= 0);
            if (estado == "pocos") q = q.Where(p => p.Stock <= p.StockMinimo);
            return (await q.OrderBy(p => p.Busqueda).ToListAsync()).Select(ADto);
        });

        g.MapGet("/{id:int}", async (int id, AppDb db) =>
        {
            var p = await BuscarAsync(db, id);
            var vendidas = await db.VentaItems.Where(i => i.ProductoId == id && !i.Venta!.Anulada)
                .SumAsync(i => (int?)(i.Cantidad - i.CantidadDevuelta)) ?? 0;
            var enLista = await db.PorTraer.AnyAsync(t => t.ProductoId == id);
            var ultimo = await db.Surtidos.Where(s => s.Items.Any(i => i.ProductoId == id)).MaxAsync(s => (DateTime?)s.Fecha);
            return Results.Ok(new ProductoDetalleDto(ADto(p), vendidas, enLista, ultimo));
        });

        g.MapPost("", async (ProductoInput input, AppDb db, Reloj reloj) =>
        {
            var p = new Producto { Nombre = "", CreadoEn = reloj.Ahora };
            await AplicarAsync(p, input, db);
            db.Productos.Add(p);
            await db.SaveChangesAsync();
            await db.Entry(p).Reference(x => x.Categoria).LoadAsync();
            return Results.Ok(ADto(p));
        });

        g.MapPut("/{id:int}", async (int id, ProductoInput input, AppDb db) =>
        {
            var p = await BuscarAsync(db, id);
            await AplicarAsync(p, input, db);
            await db.SaveChangesAsync();
            await db.Entry(p).Reference(x => x.Categoria).LoadAsync();
            return Results.Ok(ADto(p));
        });

        // Se oculta en vez de borrarse: las ventas pasadas siguen mostrando qué se vendió.
        g.MapDelete("/{id:int}", async (int id, AppDb db) =>
        {
            var p = await BuscarAsync(db, id);
            p.Activo = false;
            await db.PorTraer.Where(t => t.ProductoId == id && !t.Conseguido).ExecuteDeleteAsync();
            await db.SaveChangesAsync();
            return Results.NoContent();
        });

        g.MapPost("/{id:int}/stock", async (int id, AjusteStockInput input, AppDb db) =>
        {
            var p = await BuscarAsync(db, id);
            Regla.Cumplir(p.Stock + input.Cambio >= 0, "No puede quedar menos de 0 unidades.");
            p.Stock += input.Cambio;
            await db.SaveChangesAsync();
            return Results.Ok(ADto(p));
        });
    }

    public static async Task<Producto> BuscarAsync(AppDb db, int id) =>
        Regla.Existe(await db.Productos.Include(x => x.Categoria).FirstOrDefaultAsync(x => x.Id == id && x.Activo), "el producto");

    private static async Task AplicarAsync(Producto p, ProductoInput input, AppDb db)
    {
        var nombre = Texto.Limpiar(input.Nombre);
        Regla.Cumplir(nombre is not null, "Escribe el nombre del producto.");
        Regla.Cumplir(await db.Categorias.AnyAsync(c => c.Id == input.CategoriaId), "Elige una categoría.");
        Regla.Cumplir(input.PrecioVenta > 0, "Escribe el precio de venta.");
        Regla.Cumplir(input.PrecioCompra >= 0, "El precio de compra no puede ser negativo.");
        Regla.Cumplir(input.Stock >= 0, "Las unidades no pueden ser negativas.");
        Regla.Cumplir(input.StockMinimo >= 0, "El aviso de pocas unidades no puede ser negativo.");

        p.Nombre = nombre!;
        p.Busqueda = Texto.Normalizar(nombre);
        p.Descripcion = Texto.Limpiar(input.Descripcion);
        p.CategoriaId = input.CategoriaId;
        p.PrecioCompra = input.PrecioCompra;
        p.PrecioVenta = input.PrecioVenta;
        p.Stock = input.Stock;
        p.StockMinimo = input.StockMinimo;
    }
}
