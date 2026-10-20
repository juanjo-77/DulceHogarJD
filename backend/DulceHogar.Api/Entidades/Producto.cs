namespace DulceHogar.Api.Entidades;

public class Categoria
{
    public int Id { get; set; }
    public required string Nombre { get; set; }
    public string Icono { get; set; } = "🎁";
    public int Orden { get; set; }
    public List<Producto> Productos { get; set; } = [];
}

public class Producto
{
    public int Id { get; set; }
    public required string Nombre { get; set; }
    /// <summary>Nombre en minúsculas y sin tildes, para que "sabana" encuentre "Sábana".</summary>
    public string Busqueda { get; set; } = "";
    public string? Descripcion { get; set; }
    public int CategoriaId { get; set; }
    public Categoria? Categoria { get; set; }
    public long PrecioCompra { get; set; }
    public long PrecioVenta { get; set; }
    public int Stock { get; set; }
    /// <summary>Con estas unidades o menos, la app avisa que se está acabando.</summary>
    public int StockMinimo { get; set; } = 2;
    public string? Foto { get; set; }
    public bool Activo { get; set; } = true;
    public DateTime CreadoEn { get; set; }
}
