namespace DulceHogar.Api.Features;

public record ClienteDto(
    int Id, string Nombre, string? Telefono, string? Cedula, string? Direccion, string? Notas,
    long Debe, int CuentasAbiertas, DateTime? UltimaCompra);

public record ClienteInput(string Nombre, string? Telefono, string? Cedula, string? Direccion, string? Notas);

public record ClienteDetalleDto(
    ClienteDto Cliente, long TotalComprado, int Compras,
    List<CuentaDto> Cuentas, List<VentaResumenDto> Historial, List<EncargoDto> Encargos);
