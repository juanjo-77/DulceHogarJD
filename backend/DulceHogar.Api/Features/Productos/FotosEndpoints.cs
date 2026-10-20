using DulceHogar.Api.Common;
using DulceHogar.Api.Data;
using DulceHogar.Api.Entidades;
using Microsoft.EntityFrameworkCore;
using static DulceHogar.Api.Features.ProductosMapeo;

namespace DulceHogar.Api.Features;

/// <summary>Fotos de productos, guardadas en la base de datos.</summary>
public static class FotosEndpoints
{
    private const long PesoMaximo = 5 * 1024 * 1024;
    private static readonly string[] TiposPermitidos = ["image/jpeg", "image/png", "image/webp"];

    public static void MapFotos(this IEndpointRouteBuilder api)
    {
        var g = api.MapGroup("/productos/{id:int}/foto").WithTags("Productos");

        g.MapPost("", async (int id, IFormFile foto, AppDb db, Reloj reloj) =>
        {
            var p = await ProductosEndpoints.BuscarAsync(db, id);
            Regla.Cumplir(foto.Length is > 0 and <= PesoMaximo, "La foto debe pesar menos de 5 MB.");

            using var memoria = new MemoryStream();
            await foto.CopyToAsync(memoria);
            await BorrarAsync(db, p);
            var tipo = TiposPermitidos.Contains(foto.ContentType) ? foto.ContentType : "image/jpeg";
            var nueva = new FotoProducto { ProductoId = id, Datos = memoria.ToArray(), Tipo = tipo, CreadoEn = reloj.Ahora };
            db.Fotos.Add(nueva);
            await db.SaveChangesAsync();

            // Cada foto nueva tiene otra dirección, así el celular nunca muestra la vieja guardada.
            p.Foto = $"/fotos/{nueva.Id}";
            await db.SaveChangesAsync();
            return Results.Ok(ADto(p));
        }).DisableAntiforgery();

        g.MapDelete("", async (int id, AppDb db) =>
        {
            var p = await ProductosEndpoints.BuscarAsync(db, id);
            await BorrarAsync(db, p);
            await db.SaveChangesAsync();
            return Results.Ok(ADto(p));
        });
    }

    /// <summary>Sirve las fotos fuera de /api: no piden PIN y se guardan en caché por mucho tiempo.</summary>
    public static void MapVerFotos(this IEndpointRouteBuilder app) =>
        app.MapGet("/fotos/{id:int}", async (int id, AppDb db, HttpContext ctx) =>
        {
            var f = await db.Fotos.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
            if (f is null) return Results.NotFound();
            ctx.Response.Headers.CacheControl = "public, max-age=31536000, immutable";
            ctx.Response.Headers.XContentTypeOptions = "nosniff";
            return Results.File(f.Datos, f.Tipo);
        }).WithTags("Productos");

    private static async Task BorrarAsync(AppDb db, Producto p)
    {
        await db.Fotos.Where(f => f.ProductoId == p.Id).ExecuteDeleteAsync();
        p.Foto = null;
    }
}
