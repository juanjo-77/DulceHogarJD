namespace DulceHogar.Api.Features;

public record PorTraerDto(
    int Id, int? ProductoId, string Descripcion, string? Icono, int Cantidad, bool Conseguido, string? Nota,
    int? Stock, long? CostoReferencia, int? EncargoId, DateTime CreadoEn);

public record PorTraerInput(int? ProductoId, string? Descripcion, int Cantidad, string? Nota);
public record ConseguidoInput(bool Conseguido);

public record ProveedorDto(int Id, string Nombre, string? Telefono, string? Notas, long TotalComprado, DateTime? UltimaCompra);
public record ProveedorInput(string Nombre, string? Telefono, string? Notas);

public record SurtidoResumenDto(int Id, DateTime Fecha, string? Proveedor, long Total, int Unidades, string Descripcion);
public record SurtidoItemDto(int Id, int ProductoId, string Nombre, int Cantidad, long CostoUnitario, long Subtotal);

public record SurtidoDetalleDto(
    int Id, DateTime Fecha, int? ProveedorId, string? Proveedor, string? Notas, long Total, List<SurtidoItemDto> Items);

public record NuevoProductoInput(string Nombre, int CategoriaId, long PrecioVenta, int? StockMinimo);
public record SurtidoItemInput(int? ProductoId, NuevoProductoInput? Nuevo, int Cantidad, long CostoUnitario, int? PorTraerId);

public record SurtidoInput(
    int? ProveedorId, string? ProveedorNombre, string? Notas, List<SurtidoItemInput> Items, bool ActualizarCosto = true);
