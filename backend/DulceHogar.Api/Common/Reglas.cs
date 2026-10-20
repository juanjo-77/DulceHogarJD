using Microsoft.AspNetCore.Diagnostics;

namespace DulceHogar.Api.Common;

/// <summary>Error de una regla del negocio. El mensaje se le muestra tal cual a la usuaria.</summary>
public sealed class ReglaException(string mensaje, int status = StatusCodes.Status400BadRequest) : Exception(mensaje)
{
    public int Status { get; } = status;
}

public static class Regla
{
    public static void Cumplir(bool condicion, string mensaje)
    {
        if (!condicion) throw new ReglaException(mensaje);
    }

    public static T Existe<T>(T? valor, string que) where T : class =>
        valor ?? throw new ReglaException($"No encontramos {que}. Puede que lo hayan borrado.", StatusCodes.Status404NotFound);
}

/// <summary>Convierte una <see cref="ReglaException"/> en una respuesta ProblemDetails con el mensaje en español.</summary>
public sealed class ManejadorDeReglas(IProblemDetailsService problemas) : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(HttpContext ctx, Exception ex, CancellationToken ct)
    {
        var (status, mensaje) = ex switch
        {
            ReglaException regla => (regla.Status, regla.Message),
            // Datos mal formados: es culpa de quien los manda, no un error del programa.
            BadHttpRequestException => (StatusCodes.Status400BadRequest, "Los datos llegaron incompletos o dañados. Intenta de nuevo."),
            _ => (0, ""),
        };
        if (status == 0) return false;

        ctx.Response.StatusCode = status;
        return await problemas.TryWriteAsync(new ProblemDetailsContext
        {
            HttpContext = ctx,
            ProblemDetails = { Status = status, Title = "No se pudo completar", Detail = mensaje },
        });
    }
}
