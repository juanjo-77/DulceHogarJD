namespace DulceHogar.Api.Common;

/// <summary>Hora de Colombia, aunque el servidor esté en otra zona horaria (Render corre en UTC).</summary>
public sealed class Reloj(TimeProvider tiempo, IConfiguration config)
{
    private readonly TimeZoneInfo _zona = TimeZoneInfo.FindSystemTimeZoneById(config["ZonaHoraria"] ?? "America/Bogota");

    public DateTime Ahora => TimeZoneInfo.ConvertTime(tiempo.GetUtcNow(), _zona).DateTime;

    public DateOnly Hoy => DateOnly.FromDateTime(Ahora);
}
