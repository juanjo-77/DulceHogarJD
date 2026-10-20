using DulceHogar.Api.Common;
using DulceHogar.Api.Data;
using DulceHogar.Api.Entidades;
using Microsoft.EntityFrameworkCore;

namespace DulceHogar.Api.Features;

/// <summary>Lo que se ve al abrir la app: cómo va el día y qué necesita atención.</summary>
public sealed class InicioServicio(AppDb db, CajaServicio caja, Reloj reloj)
{
    public async Task<InicioDto> CrearAsync()
    {
        var hoy = reloj.Hoy;
        var inicio = hoy.ToDateTime(TimeOnly.MinValue);

        var ventasHoy = await db.Ventas.Where(v => v.Fecha >= inicio && !v.Anulada).Select(v => v.Total).ToListAsync();
        var movimientos = await caja.MovimientosAsync(hoy, hoy.AddDays(1));

        var abiertas = await db.Ventas.Include(v => v.Cliente).Include(v => v.Items).AsSplitQuery()
            .Where(v => !v.Anulada && (v.Total > v.Pagado || (v.Tipo == TipoVenta.Separe && !v.Entregada)))
            .ToListAsync();
        var deudas = abiertas.Where(v => v.Saldo > 0).ToList();

        var bajos = await db.Productos.Where(p => p.Activo && p.Stock <= p.StockMinimo)
            .OrderBy(p => p.Stock).ThenBy(p => p.Busqueda).ToListAsync();
        var encargos = await db.Encargos.Include(e => e.Cliente)
            .Where(e => e.Estado == EstadoEncargo.Pendiente || e.Estado == EstadoEncargo.Listo)
            .OrderBy(e => e.FechaEntrega).ToListAsync();

        var alertas = new Alertas(hoy);
        alertas.Vencidas(deudas);
        alertas.Pedidos(encargos);
        alertas.ParaEntregar(abiertas);
        alertas.Inventario(bajos);
        alertas.ProximasAVencer(deudas);

        return new InicioDto(
            ventasHoy.Sum(), ventasHoy.Count,
            movimientos.Where(m => m.Entrada).Sum(m => m.Monto), movimientos.Where(m => !m.Entrada).Sum(m => m.Monto),
            deudas.Sum(v => v.Saldo), deudas.Select(v => v.ClienteId).Distinct().Count(),
            bajos.Count(p => p.Stock <= 0), bajos.Count(p => p.Stock > 0), encargos.Count,
            await db.PorTraer.CountAsync(t => !t.Conseguido), alertas.Lista);
    }
}
