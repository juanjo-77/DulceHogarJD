using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;
using Npgsql;

namespace DulceHogar.Api.Data;

/// <summary>
/// Arma la conexión a Postgres desde ConnectionStrings:Default. Acepta tal cual la que copia
/// Neon (postgresql://usuario:clave@host/base?sslmode=require) o el formato clásico de Npgsql.
/// </summary>
public static class Conexion
{
    public static string Postgres(IConfiguration config)
    {
        var valor = config.GetConnectionString("Default")?.Trim();
        if (string.IsNullOrEmpty(valor))
        {
            // "dotnet ef migrations add" arma la app sin base de datos real.
            if (EF.IsDesignTime) return "Host=localhost;Database=diseno";
            throw new InvalidOperationException(
                "Falta la conexión a la base de datos. Configura ConnectionStrings__Default con la de Neon.");
        }
        return valor.StartsWith("postgres", StringComparison.OrdinalIgnoreCase) ? DesdeUrl(valor) : valor;
    }

    private static string DesdeUrl(string url)
    {
        var uri = new Uri(url);
        var usuario = uri.UserInfo.Split(':', 2);
        var opciones = QueryHelpers.ParseQuery(uri.Query);

        var conexion = new NpgsqlConnectionStringBuilder
        {
            Host = uri.Host,
            Port = uri.Port > 0 ? uri.Port : 5432,
            Database = uri.AbsolutePath.Trim('/'),
            Username = Uri.UnescapeDataString(usuario[0]),
            Password = usuario.Length > 1 ? Uri.UnescapeDataString(usuario[1]) : null,
            SslMode = SslMode.Require,
        };
        if (opciones.TryGetValue("sslmode", out var ssl) && Enum.TryParse<SslMode>(ssl.ToString().Replace("-", ""), true, out var modo))
            conexion.SslMode = modo;
        if (opciones.TryGetValue("channel_binding", out var canal) && canal.ToString().Equals("require", StringComparison.OrdinalIgnoreCase))
            conexion.ChannelBinding = ChannelBinding.Require;
        return conexion.ConnectionString;
    }
}
