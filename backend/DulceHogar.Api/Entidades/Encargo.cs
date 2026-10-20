namespace DulceHogar.Api.Entidades;

/// <summary>Pedido de un cliente: algo que hay que entregarle en una fecha.</summary>
public class Encargo
{
    public int Id { get; set; }
    public int ClienteId { get; set; }
    public Cliente? Cliente { get; set; }
    public DateOnly FechaEntrega { get; set; }
    public EstadoEncargo Estado { get; set; }
    public string? Notas { get; set; }
    public DateTime CreadoEn { get; set; }
    /// <summary>La venta con la que se entregó.</summary>
    public int? VentaId { get; set; }
    public List<EncargoItem> Items { get; set; } = [];
}

public class EncargoItem
{
    public int Id { get; set; }
    public int EncargoId { get; set; }
    /// <summary>Puede ser un producto que todavía no existe en el inventario.</summary>
    public int? ProductoId { get; set; }
    public Producto? Producto { get; set; }
    public required string Descripcion { get; set; }
    public int Cantidad { get; set; }
}
