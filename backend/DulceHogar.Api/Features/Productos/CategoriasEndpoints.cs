using DulceHogar.Api.Common;
using DulceHogar.Api.Data;
using DulceHogar.Api.Entidades;
using Microsoft.EntityFrameworkCore;

namespace DulceHogar.Api.Features;

public static class CategoriasEndpoints
{
    public static void MapCategorias(this IEndpointRouteBuilder api)
    {
        var g = api.MapGroup("/categorias").WithTags("Categorías");

        g.MapGet("", async (AppDb db) =>
            await db.Categorias.OrderBy(c => c.Orden).ThenBy(c => c.Nombre)
                .Select(c => new CategoriaDto(c.Id, c.Nombre, c.Icono, c.Orden, c.Productos.Count(p => p.Activo)))
                .ToListAsync());

        g.MapPost("", async (CategoriaInput input, AppDb db) =>
        {
            var nombre = await ValidarAsync(db, input, null);
            var orden = input.Orden ?? (await db.Categorias.MaxAsync(c => (int?)c.Orden) ?? 0) + 1;
            var c = new Categoria { Nombre = nombre, Icono = Texto.Limpiar(input.Icono) ?? "🎁", Orden = orden };
            db.Categorias.Add(c);
            await db.SaveChangesAsync();
            return Results.Ok(new CategoriaDto(c.Id, c.Nombre, c.Icono, c.Orden, 0));
        });

        g.MapPut("/{id:int}", async (int id, CategoriaInput input, AppDb db) =>
        {
            var c = Regla.Existe(await db.Categorias.FindAsync(id), "la categoría");
            c.Nombre = await ValidarAsync(db, input, id);
            c.Icono = Texto.Limpiar(input.Icono) ?? c.Icono;
            c.Orden = input.Orden ?? c.Orden;
            await db.SaveChangesAsync();
            var productos = await db.Productos.CountAsync(p => p.CategoriaId == id && p.Activo);
            return Results.Ok(new CategoriaDto(c.Id, c.Nombre, c.Icono, c.Orden, productos));
        });

        g.MapDelete("/{id:int}", async (int id, AppDb db) =>
        {
            var c = Regla.Existe(await db.Categorias.FindAsync(id), "la categoría");
            var activos = await db.Productos.CountAsync(p => p.CategoriaId == id && p.Activo);
            Regla.Cumplir(activos == 0, $"Esta categoría tiene {activos} producto(s). Pásalos a otra categoría antes de borrarla.");

            // Los productos ya borrados conservan su historial: se mueven a otra categoría.
            var borrados = await db.Productos.Where(p => p.CategoriaId == id).ToListAsync();
            if (borrados.Count > 0)
            {
                var otra = await db.Categorias.Where(x => x.Id != id).OrderBy(x => x.Orden).FirstOrDefaultAsync();
                Regla.Cumplir(otra is not null, "Debe quedar al menos una categoría.");
                borrados.ForEach(p => p.CategoriaId = otra!.Id);
            }
            db.Categorias.Remove(c);
            await db.SaveChangesAsync();
            return Results.NoContent();
        });
    }

    private static async Task<string> ValidarAsync(AppDb db, CategoriaInput input, int? id)
    {
        var nombre = Texto.Limpiar(input.Nombre);
        Regla.Cumplir(nombre is not null, "Escribe el nombre de la categoría.");
        var existentes = await db.Categorias.Where(c => c.Id != id).Select(c => c.Nombre).ToListAsync();
        Regla.Cumplir(existentes.All(n => Texto.Normalizar(n) != Texto.Normalizar(nombre)), $"Ya existe la categoría \"{nombre}\".");
        return nombre!;
    }
}
