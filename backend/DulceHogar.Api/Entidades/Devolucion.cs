namespace DulceHogar.Api.Entidades;

public class Devolucion
{
    public int Id { get; set; }
    public int VentaId { get; set; }
    public Venta? Venta { get; set; }
    public DateTime Fecha { get; set; }
    public string? Motivo { get; set; }
    public bool VuelveAlInventario { get; set; }
    public long MontoReembolsado { get; set; }
    /// <summary>Resumen legible de lo devuelto, p. ej. "2 × Toalla grande".</summary>
    public required string Devuelto { get; set; }
    /// <summary>Lo que se llevó a cambio, si fue un cambio.</summary>
    public string? Cambio { get; set; }
    public List<DevolucionItem> Items { get; set; } = [];
}

public class DevolucionItem
{
    public int Id { get; set; }
    public int DevolucionId { get; set; }
    public int VentaItemId { get; set; }
    public VentaItem? VentaItem { get; set; }
    public int Cantidad { get; set; }
}
