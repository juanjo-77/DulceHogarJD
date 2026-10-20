using DulceHogar.Api.Entidades;

namespace DulceHogar.Api.Features;

public record ClienteMini(int Id, string Nombre, string? Telefono);

public record VentaResumenDto(
    int Id, DateTime Fecha, TipoVenta Tipo, EstadoCuenta Estado, ClienteMini? Cliente, string Descripcion,
    long Total, long Pagado, long Saldo, DateOnly? FechaLimite, bool Entregada);

public record VentaItemDto(int Id, int ProductoId, string Nombre, int Cantidad, int CantidadDevuelta, long PrecioUnitario, long Subtotal);

public record AbonoDto(int Id, DateTime Fecha, long Monto, MetodoPago Metodo, string? Nota);

public record DevolucionDto(
    int Id, int VentaId, DateTime Fecha, string Devuelto, string? Cambio, bool VuelveAlInventario,
    long MontoReembolsado, string? Motivo, ClienteMini? Cliente);

public record VentaDetalleDto(
    int Id, DateTime Fecha, TipoVenta Tipo, EstadoCuenta Estado, ClienteMini? Cliente,
    List<VentaItemDto> Items, List<AbonoDto> Abonos, List<DevolucionDto> Devoluciones,
    long Total, long Pagado, long Saldo, DateOnly? FechaLimite, int? DiasRestantes,
    bool Entregada, DateTime? EntregadaEn, bool Anulada, string? Notas, int? EncargoId);

/// <summary>Una cuenta por cobrar: un fiado o un plan separe que todavía no se ha cerrado.</summary>
public record CuentaDto(
    int VentaId, TipoVenta Tipo, EstadoCuenta Estado, ClienteMini? Cliente, string Descripcion, DateTime Fecha,
    long Total, long Pagado, long Saldo, DateOnly? FechaLimite, int? DiasRestantes, DateTime? UltimoAbono);

public record NegocioDto(string Nombre, string? Telefono, string? Mensaje);

public record ReciboDto(
    int Numero, DateTime Fecha, long Monto, MetodoPago Metodo, string? Nota,
    int VentaId, TipoVenta Tipo, ClienteMini? Cliente, string Descripcion,
    long Total, long PagadoHastaAhora, long SaldoDespues, NegocioDto Negocio);

public record VentaItemInput(int ProductoId, int Cantidad, long? PrecioUnitario);

public record VentaInput(
    int? ClienteId, TipoVenta Tipo, List<VentaItemInput> Items, long AbonoInicial,
    MetodoPago Metodo, DateOnly? FechaLimite, string? Notas, int? EncargoId);

public record AbonoInput(long Monto, MetodoPago Metodo, string? Nota);

public record AnularInput(long MontoReembolsado, string? Motivo);

public record DevolucionItemInput(int VentaItemId, int Cantidad);

public record DevolucionInput(
    List<DevolucionItemInput> Items, bool VuelveAlInventario, List<VentaItemInput>? Cambio,
    long MontoReembolsado, string? Motivo);
