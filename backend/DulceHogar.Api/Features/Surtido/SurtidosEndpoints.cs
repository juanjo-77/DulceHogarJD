using DulceHogar.Api.Common;
using DulceHogar.Api.Data;
using DulceHogar.Api.Entidades;
using Microsoft.EntityFrameworkCore;

namespace DulceHogar.Api.Features;

/// <summary>Historial de la mercancía que llegó (compras a proveedores).</summary>
public static class SurtidosEndpoints
{
    public static void MapSurtidos(this IEndpointRouteBuilder api)
    {
        var g = api.MapGroup("/surtidos").WithTags("Surtido");

        g.MapGet("", async (AppDb db) =>
        {
            var surtidos = await db.Surtidos.Include(s => s.Items).OrderByDescending(s => s.Fecha).Take(200).ToListAsync();
            return surtidos.Select(s => new SurtidoResumenDto(
                s.Id, s.Fecha, s.ProveedorNombre, s.Total, s.Items.Sum(i => i.Cantidad),
                Texto.Articulos(s.Items.Select(i => (i.Nombre, i.Cantidad)))));
        });

        g.MapGet("/{id:int}", async (int id, AppDb db) =>
            Results.Ok(ADetalle(Regla.Existe(await db.Surtidos.Include(x => x.Items).FirstOrDefaultAsync(x => x.Id == id), "esa compra"))));

        g.MapPost("", async (SurtidoInput input, SurtidoServicio servicio) =>
            Results.Ok(ADetalle(await servicio.RegistrarAsync(input))));

        // Borrar una compra resta del inventario lo que había entrado.
        g.MapDelete("/{id:int}", async (int id, AppDb db) =>
        {
            var s = Regla.Existe(await db.Surtidos.Include(x => x.Items).ThenInclude(i => i.Producto).FirstOrDefaultAsync(x => x.Id == id), "esa compra");
            foreach (var i in s.Items)
                Regla.Cumplir(i.Producto!.Stock >= i.Cantidad,
                    $"Ya vendiste parte de {i.Nombre} de esta compra, así que no se puede borrar. Corrige las unidades desde el producto.");
            foreach (var i in s.Items) i.Producto!.Stock -= i.Cantidad;
            db.Surtidos.Remove(s);
            await db.SaveChangesAsync();
            return Results.NoContent();
        });
    }

    private static SurtidoDetalleDto ADetalle(Surtido s) => new(
        s.Id, s.Fecha, s.ProveedorId, s.ProveedorNombre, s.Notas, s.Total,
        s.Items.OrderBy(i => i.Id)
            .Select(i => new SurtidoItemDto(i.Id, i.ProductoId, i.Nombre, i.Cantidad, i.CostoUnitario, i.Cantidad * i.CostoUnitario))
            .ToList());
}
