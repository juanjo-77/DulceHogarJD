using System.Collections.Concurrent;

namespace DulceHogar.Api.Common;

/// <summary>
/// Frena a quien prueba PINs al azar: después de varios fallos seguidos desde la misma
/// conexión, se bloquea un minuto. Un acierto borra la cuenta.
/// </summary>
public sealed class IntentosPin(TimeProvider tiempo)
{
    private const int MaximoFallos = 8;
    private static readonly TimeSpan Bloqueo = TimeSpan.FromMinutes(1);

    private readonly ConcurrentDictionary<string, (int Fallos, DateTimeOffset Hasta)> _porOrigen = new();

    public bool EstaBloqueado(string origen) =>
        _porOrigen.TryGetValue(origen, out var e) && e.Fallos >= MaximoFallos && e.Hasta > tiempo.GetUtcNow();

    public void Fallo(string origen)
    {
        var ahora = tiempo.GetUtcNow();
        // Si pasó más de un minuto desde el último fallo, se vuelve a contar desde cero.
        _porOrigen.AddOrUpdate(origen,
            _ => (1, ahora + Bloqueo),
            (_, e) => e.Hasta <= ahora ? (1, ahora + Bloqueo) : (e.Fallos + 1, ahora + Bloqueo));
    }

    public void Acierto(string origen) => _porOrigen.TryRemove(origen, out _);
}
