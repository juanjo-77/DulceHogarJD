using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;

namespace DulceHogar.Api.Common;

/// <summary>
/// Si la configuración trae un PIN (Acceso:Pin), toda la API lo pide en el encabezado X-Pin.
/// Sin PIN configurado la app funciona abierta, como en la red de la casa.
/// </summary>
public sealed partial class AccesoPorPin(RequestDelegate siguiente, IConfiguration config, IntentosPin intentos, IProblemDetailsService problemas)
{
    public const string Encabezado = "X-Pin";

    /// <summary>¿Hay PIN configurado? Falla al arrancar si el PIN no son de 4 a 8 números.</summary>
    public static bool Configurado(IConfiguration config)
    {
        var pin = config["Acceso:Pin"]?.Trim();
        if (string.IsNullOrEmpty(pin)) return false;
        if (!SoloNumeros().IsMatch(pin)) throw new InvalidOperationException("Acceso:Pin debe tener entre 4 y 8 números.");
        return true;
    }

    public async Task InvokeAsync(HttpContext ctx)
    {
        if (!Configurado(config) || !RequierePin(ctx.Request))
        {
            await siguiente(ctx);
            return;
        }

        var origen = ctx.Connection.RemoteIpAddress?.ToString() ?? "desconocido";
        if (intentos.EstaBloqueado(origen))
        {
            await RechazarAsync(ctx, StatusCodes.Status429TooManyRequests, "Te equivocaste varias veces. Espera un minuto y vuelve a intentar.");
            return;
        }

        var enviado = ctx.Request.Headers[Encabezado].ToString();
        if (Iguales(enviado, config["Acceso:Pin"]!.Trim()))
        {
            intentos.Acierto(origen);
            await siguiente(ctx);
            return;
        }

        // Solo cuenta como fallo si de verdad mandaron un PIN (la app recién abierta no manda nada).
        if (enviado.Length > 0) intentos.Fallo(origen);
        await RechazarAsync(ctx, StatusCodes.Status401Unauthorized, "El PIN no es correcto. Escríbelo de nuevo.");
    }

    private static bool RequierePin(HttpRequest r) =>
        r.Path.StartsWithSegments("/api") && !r.Path.StartsWithSegments("/api/salud") && !HttpMethods.IsOptions(r.Method);

    /// <summary>Compara sin delatar, por el tiempo que tarda, cuántos números acertó.</summary>
    private static bool Iguales(string a, string b) =>
        CryptographicOperations.FixedTimeEquals(SHA256.HashData(Encoding.UTF8.GetBytes(a)), SHA256.HashData(Encoding.UTF8.GetBytes(b)));

    private Task RechazarAsync(HttpContext ctx, int status, string mensaje)
    {
        ctx.Response.StatusCode = status;
        return problemas.WriteAsync(new ProblemDetailsContext
        {
            HttpContext = ctx,
            ProblemDetails = { Status = status, Title = "PIN", Detail = mensaje },
        }).AsTask();
    }

    [GeneratedRegex(@"^\d{4,8}$")]
    private static partial Regex SoloNumeros();
}
