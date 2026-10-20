namespace DulceHogar.Api.Entidades;

/// <summary>
/// La foto de un producto, guardada dentro de la base de datos: en Render el disco
/// se borra en cada reinicio, así que ahí no pueden vivir archivos.
/// </summary>
public class FotoProducto
{
    public int Id { get; set; }
    public int ProductoId { get; set; }
    public required byte[] Datos { get; set; }
    public required string Tipo { get; set; }
    public DateTime CreadoEn { get; set; }
}
