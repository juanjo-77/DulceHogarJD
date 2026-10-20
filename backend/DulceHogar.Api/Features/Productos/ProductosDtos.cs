using DulceHogar.Api.Entidades;

namespace DulceHogar.Api.Features;

public record CategoriaDto(int Id, string Nombre, string Icono, int Orden, int Productos);
public record CategoriaInput(string Nombre, string? Icono, int? Orden);

public record ProductoDto(
    int Id, string Nombre, string? Descripcion, int CategoriaId, string Categoria, string Icono,
    long PrecioCompra, long PrecioVenta, int Stock, int StockMinimo, string? Foto, string EstadoStock);

public record ProductoDetalleDto(ProductoDto Producto, int UnidadesVendidas, bool EnListaSurtir, DateTime? UltimoSurtido);

public record ProductoInput(
    string Nombre, string? Descripcion, int CategoriaId, long PrecioCompra, long PrecioVenta, int Stock, int StockMinimo);

public record AjusteStockInput(int Cambio);

public static class ProductosMapeo
{
    public static ProductoDto ADto(Producto p) => new(
        p.Id, p.Nombre, p.Descripcion, p.CategoriaId, p.Categoria?.Nombre ?? "", p.Categoria?.Icono ?? "🎁",
        p.PrecioCompra, p.PrecioVenta, p.Stock, p.StockMinimo, p.Foto, EstadoStock(p.Stock, p.StockMinimo));

    public static string EstadoStock(int stock, int minimo) =>
        stock <= 0 ? "Agotado" : stock <= minimo ? "Poco" : "Bien";
}
