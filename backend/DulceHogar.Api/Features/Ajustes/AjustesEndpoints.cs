using DulceHogar.Api.Common;
using DulceHogar.Api.Data;
using Microsoft.EntityFrameworkCore;

namespace DulceHogar.Api.Features;

public record AjustesInput(string NombreNegocio, string? Telefono, string? MensajeRecibo);

/// <summary>Datos del negocio que salen en los recibos y mensajes de WhatsApp.</summary>
public static class AjustesEndpoints
{
    public static void MapAjustes(this IEndpointRouteBuilder api)
    {
        var g = api.MapGroup("/ajustes").WithTags("Ajustes");

        g.MapGet("", async (AppDb db) => await db.Ajustes.OrderBy(a => a.Id).FirstAsync());

        g.MapPut("", async (AjustesInput input, AppDb db) =>
        {
            var a = await db.Ajustes.OrderBy(a => a.Id).FirstAsync();
            var nombre = Texto.Limpiar(input.NombreNegocio);
            Regla.Cumplir(nombre is not null, "Escribe el nombre del negocio.");
            a.NombreNegocio = nombre!;
            a.Telefono = Texto.Limpiar(input.Telefono);
            a.MensajeRecibo = Texto.Limpiar(input.MensajeRecibo);
            await db.SaveChangesAsync();
            return Results.Ok(a);
        });
    }
}
