using DulceHogar.Api.Common;
using DulceHogar.Api.Data;
using DulceHogar.Api.Entidades;
using Microsoft.EntityFrameworkCore;

namespace DulceHogar.Api.Features;

/// <summary>Registra una venta de contado, fiada o por plan separe.</summary>
public sealed class VentaServicio(AppDb db, InventarioServicio inventario, Reloj reloj)
{
    public async Task<Venta> CrearAsync(VentaInput input)
    {
        Regla.Cumplir(input.Items is { Count: > 0 }, "Agrega al menos un producto.");
        Regla.Cumplir(input.Tipo == TipoVenta.Contado || input.ClienteId is not null,
            input.Tipo == TipoVenta.Fiado ? "Para fiar, elige a quién le vendes." : "Para el plan separe, elige a quién le vendes.");

        Cliente? cliente = null;
        if (input.ClienteId is { } cid)
            cliente = Regla.Existe(await db.Clientes.FirstOrDefaultAsync(c => c.Id == cid && c.Activo), "el cliente");

        var ahora = reloj.Ahora;
        var seLoLleva = input.Tipo != TipoVenta.Separe;
        var venta = new Venta
        {
            Cliente = cliente, Fecha = ahora, Tipo = input.Tipo, Notas = Texto.Limpiar(input.Notas),
            Entregada = seLoLleva, EntregadaEn = seLoLleva ? ahora : null,
            FechaLimite = FechaLimite(input),
        };
        Regla.Cumplir(venta.FechaLimite is null || venta.FechaLimite >= reloj.Hoy, "La fecha de pago no puede ser en el pasado.");

        venta.Items.AddRange(await inventario.SacarAsync(input.Items));
        venta.Recalcular();
        AgregarPagoInicial(venta, input, ahora);

        var encargo = await CerrarEncargoAsync(input.EncargoId);
        venta.EncargoId = encargo?.Id;
        venta.Recalcular();
        db.Ventas.Add(venta);
        await db.SaveChangesAsync();

        if (encargo is not null)
        {
            encargo.VentaId = venta.Id;
            await db.SaveChangesAsync();
        }
        return venta;
    }

    // Si no se elige fecha: el fiado se paga en un mes y el plan separe tiene dos meses.
    private DateOnly? FechaLimite(VentaInput input) => input.Tipo switch
    {
        TipoVenta.Contado => null,
        TipoVenta.Fiado => input.FechaLimite ?? reloj.Hoy.AddDays(30),
        _ => input.FechaLimite ?? reloj.Hoy.AddDays(60),
    };

    private static void AgregarPagoInicial(Venta venta, VentaInput input, DateTime ahora)
    {
        var inicial = input.Tipo == TipoVenta.Contado ? venta.Total : input.AbonoInicial;
        Regla.Cumplir(inicial >= 0, "El abono no puede ser negativo.");
        Regla.Cumplir(inicial <= venta.Total, $"El abono no puede ser mayor que el total ({Texto.Pesos(venta.Total)}).");
        if (inicial == 0) return;

        venta.Abonos.Add(new Abono
        {
            Fecha = ahora, Monto = inicial, Metodo = input.Metodo,
            Nota = input.Tipo == TipoVenta.Contado ? null : "Cuota inicial",
        });
    }

    private async Task<Encargo?> CerrarEncargoAsync(int? encargoId)
    {
        if (encargoId is not { } id) return null;
        var encargo = Regla.Existe(await db.Encargos.FindAsync(id), "el pedido");
        Regla.Cumplir(encargo.Estado is EstadoEncargo.Pendiente or EstadoEncargo.Listo, "Este pedido ya fue entregado o cancelado.");
        encargo.Estado = EstadoEncargo.Entregado;
        return encargo;
    }
}
