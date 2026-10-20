namespace DulceHogar.Api.Entidades;

/// <summary>Un renglón de la lista de lo que hay que traer cuando vaya a surtir.</summary>
public class PorTraer
{
    public int Id { get; set; }
    public int? ProductoId { get; set; }
    public Producto? Producto { get; set; }
    public required string Descripcion { get; set; }
    public int Cantidad { get; set; }
    public bool Conseguido { get; set; }
    public string? Nota { get; set; }
    public DateTime CreadoEn { get; set; }
    public int? EncargoId { get; set; }
    public Encargo? Encargo { get; set; }
}

public class Proveedor
{
    public int Id { get; set; }
    public required string Nombre { get; set; }
    public string Busqueda { get; set; } = "";
    public string? Telefono { get; set; }
    public string? Notas { get; set; }
}

/// <summary>Mercancía que llegó: una compra a un proveedor.</summary>
public class Surtido
{
    public int Id { get; set; }
    public DateTime Fecha { get; set; }
    public int? ProveedorId { get; set; }
    public Proveedor? Proveedor { get; set; }
    /// <summary>Copia del nombre, por si luego se borra el proveedor.</summary>
    public string? ProveedorNombre { get; set; }
    public string? Notas { get; set; }
    public long Total { get; set; }
    public List<SurtidoItem> Items { get; set; } = [];
}

public class SurtidoItem
{
    public int Id { get; set; }
    public int SurtidoId { get; set; }
    public int ProductoId { get; set; }
    public Producto? Producto { get; set; }
    public required string Nombre { get; set; }
    public int Cantidad { get; set; }
    public long CostoUnitario { get; set; }
}
