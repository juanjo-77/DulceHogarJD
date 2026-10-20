using DulceHogar.Api.Entidades;

namespace DulceHogar.Api.Features;

public record MovimientoDto(
    string Clave, DateTime Fecha, bool Entrada, string Categoria, string Concepto, long Monto,
    MetodoPago? Metodo, int? VentaId, int? SurtidoId, int? MovimientoId);

public record CajaDto(
    DateOnly Fecha, long Entradas, long Salidas, long Neto, long EnEfectivo, long PorTransferencia,
    List<MovimientoDto> Movimientos);

public record MovimientoInput(TipoMovimiento Tipo, string Concepto, long Monto, string? Nota, DateOnly? Fecha);
