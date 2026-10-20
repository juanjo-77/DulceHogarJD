using DulceHogar.Api.Common;
using DulceHogar.Api.Data;
using Microsoft.EntityFrameworkCore;

namespace DulceHogar.Api.Features;

/// <summary>Arma el recibo de un abono, listo para mostrar o compartir.</summary>
public sealed class ReciboServicio(AppDb db)
{
    public async Task<ReciboDto> CrearAsync(int abonoId)
    {
        var abono = Regla.Existe(await db.Abonos.FindAsync(abonoId), "el abono");
        var v = (await VentasMapeo.CargarAsync(db, abono.VentaId))!;
        var negocio = await db.Ajustes.OrderBy(a => a.Id).FirstAsync();

        // Lo pagado hasta este abono (incluido): un recibo viejo sigue mostrando el saldo de ese momento.
        var pagado = v.Abonos.Where(a => a.Fecha < abono.Fecha || (a.Fecha == abono.Fecha && a.Id <= abono.Id)).Sum(a => a.Monto)
                     - v.Devoluciones.Where(d => d.Fecha <= abono.Fecha).Sum(d => d.MontoReembolsado);

        return new ReciboDto(
            abono.Id, abono.Fecha, abono.Monto, abono.Metodo, abono.Nota,
            v.Id, v.Tipo, VentasMapeo.AMini(v.Cliente), VentasMapeo.Describir(v),
            v.Total, pagado, Math.Max(v.Total - pagado, 0),
            new NegocioDto(negocio.NombreNegocio, negocio.Telefono, negocio.MensajeRecibo));
    }
}
