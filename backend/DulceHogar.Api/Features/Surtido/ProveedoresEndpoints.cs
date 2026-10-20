using DulceHogar.Api.Common;
using DulceHogar.Api.Data;
using DulceHogar.Api.Entidades;
using Microsoft.EntityFrameworkCore;

namespace DulceHogar.Api.Features;

public static class ProveedoresEndpoints
{
    public static void MapProveedores(this IEndpointRouteBuilder api)
    {
        var g = api.MapGroup("/proveedores").WithTags("Surtido");

        g.MapGet("", async (AppDb db) =>
        {
            var compras = await db.Surtidos.Where(s => s.ProveedorId != null)
                .GroupBy(s => s.ProveedorId!.Value)
                .Select(x => new { Id = x.Key, Total = x.Sum(s => s.Total), Ultima = x.Max(s => s.Fecha) })
                .ToDictionaryAsync(x => x.Id);
            var proveedores = await db.Proveedores.OrderBy(p => p.Busqueda).ToListAsync();
            return proveedores.Select(p => new ProveedorDto(p.Id, p.Nombre, p.Telefono, p.Notas,
                compras.GetValueOrDefault(p.Id)?.Total ?? 0, compras.GetValueOrDefault(p.Id)?.Ultima));
        });

        g.MapPost("", async (ProveedorInput input, AppDb db) =>
        {
            var p = new Proveedor { Nombre = "" };
            Aplicar(p, input);
            db.Proveedores.Add(p);
            await db.SaveChangesAsync();
            return Results.Ok(new ProveedorDto(p.Id, p.Nombre, p.Telefono, p.Notas, 0, null));
        });

        g.MapPut("/{id:int}", async (int id, ProveedorInput input, AppDb db) =>
        {
            var p = Regla.Existe(await db.Proveedores.FindAsync(id), "el proveedor");
            Aplicar(p, input);
            await db.SaveChangesAsync();
            return Results.Ok(new ProveedorDto(p.Id, p.Nombre, p.Telefono, p.Notas, 0, null));
        });

        // Las compras viejas conservan el nombre del proveedor aunque se borre.
        g.MapDelete("/{id:int}", async (int id, AppDb db) =>
        {
            await db.Proveedores.Where(p => p.Id == id).ExecuteDeleteAsync();
            return Results.NoContent();
        });
    }

    private static void Aplicar(Proveedor p, ProveedorInput input)
    {
        var nombre = Texto.Limpiar(input.Nombre);
        Regla.Cumplir(nombre is not null, "Escribe el nombre del proveedor.");
        p.Nombre = nombre!;
        p.Busqueda = Texto.Normalizar(nombre);
        p.Telefono = Texto.Limpiar(input.Telefono);
        p.Notas = Texto.Limpiar(input.Notas);
    }
}
