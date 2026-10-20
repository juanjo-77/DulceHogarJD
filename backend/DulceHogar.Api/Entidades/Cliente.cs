namespace DulceHogar.Api.Entidades;

public class Cliente
{
    public int Id { get; set; }
    public required string Nombre { get; set; }
    public string Busqueda { get; set; } = "";
    public string? Telefono { get; set; }
    public string? Cedula { get; set; }
    public string? Direccion { get; set; }
    public string? Notas { get; set; }
    public bool Activo { get; set; } = true;
    public DateTime CreadoEn { get; set; }
    public List<Venta> Ventas { get; set; } = [];
}
