using DulceHogar.Api.Common;
using DulceHogar.Api.Entidades;

namespace DulceHogar.Api.Features;

/// <summary>Arma los avisos del inicio, escritos como los diría una persona.</summary>
public sealed class Alertas(DateOnly hoy)
{
    public List<AlertaDto> Lista { get; } = [];

    public void Vencidas(IEnumerable<Venta> deudas)
    {
        foreach (var v in deudas.Where(v => v.Estado(hoy) == EstadoCuenta.Vencida).OrderBy(v => v.FechaLimite).Take(6))
        {
            var dias = hoy.DayNumber - v.FechaLimite!.Value.DayNumber;
            var tipo = v.Tipo == TipoVenta.Separe ? "Plan separe" : "Fiado";
            Lista.Add(new($"vencida-{v.Id}", "vencida", 2,
                $"{v.Cliente?.Nombre} debe {Texto.Pesos(v.Saldo)}", $"{tipo} vencido hace {Dias(dias)}", $"/venta/{v.Id}"));
        }
    }

    public void Pedidos(IEnumerable<Encargo> encargos)
    {
        foreach (var e in encargos.Where(e => e.FechaEntrega <= hoy.AddDays(3)).Take(5))
        {
            var dias = e.FechaEntrega.DayNumber - hoy.DayNumber;
            var cuando = dias switch
            {
                < 0 => $"se pasó hace {Dias(-dias)}",
                0 => "es para hoy",
                1 => "es para mañana",
                _ => $"es en {Dias(dias)}",
            };
            Lista.Add(new($"pedido-{e.Id}", "pedido", dias <= 0 ? 2 : 1,
                $"Pedido de {e.Cliente?.Nombre}", $"La entrega {cuando}", $"/pedido/{e.Id}"));
        }
    }

    public void ParaEntregar(IEnumerable<Venta> abiertas)
    {
        foreach (var v in abiertas.Where(v => v.Estado(hoy) == EstadoCuenta.ParaEntregar).Take(5))
            Lista.Add(new($"entregar-{v.Id}", "entregar", 1,
                $"{v.Cliente?.Nombre} ya terminó de pagar", $"Entrégale: {VentasMapeo.Describir(v)}", $"/venta/{v.Id}"));
    }

    public void Inventario(List<Producto> bajos)
    {
        var agotados = bajos.Where(p => p.Stock <= 0).ToList();
        var pocos = bajos.Where(p => p.Stock > 0).ToList();

        if (agotados.Count > 0)
            Lista.Add(new("agotados", "agotado", 1,
                agotados.Count == 1 ? $"Se agotó {agotados[0].Nombre}" : $"{agotados.Count} productos agotados",
                Resumir(agotados.Select(p => p.Nombre)), "/productos?estado=agotados"));

        if (pocos.Count > 0)
            Lista.Add(new("pocos", "poco", 0,
                pocos.Count == 1 ? $"Quedan pocas unidades de {pocos[0].Nombre}" : $"{pocos.Count} productos se están acabando",
                Resumir(pocos.Select(p => $"{p.Nombre} ({p.Stock})")), "/productos?estado=pocos"));
    }

    public void ProximasAVencer(IEnumerable<Venta> deudas)
    {
        var proximas = deudas.Where(v => v.Estado(hoy) == EstadoCuenta.Debe && v.FechaLimite is { } l && l.DayNumber - hoy.DayNumber <= 3);
        foreach (var v in proximas.Take(4))
        {
            var dias = v.FechaLimite!.Value.DayNumber - hoy.DayNumber;
            var cuando = dias switch { 0 => "hoy", 1 => "mañana", _ => $"en {Dias(dias)}" };
            Lista.Add(new($"proxima-{v.Id}", "proxima", 0,
                $"{v.Cliente?.Nombre} debe pagar {cuando}", $"Le falta {Texto.Pesos(v.Saldo)}", $"/venta/{v.Id}"));
        }
    }

    private static string Dias(int n) => n == 1 ? "1 día" : $"{n} días";

    private static string Resumir(IEnumerable<string> nombres)
    {
        var todos = nombres.ToList();
        return todos.Count <= 3 ? string.Join(", ", todos) : $"{string.Join(", ", todos.Take(3))} y {todos.Count - 3} más";
    }
}
