namespace DulceHogar.Api.Entidades;

/// <summary>Gastos del negocio (arriendo, transporte...) u otros ingresos que no son ventas.</summary>
public class Movimiento
{
    public int Id { get; set; }
    public DateTime Fecha { get; set; }
    public TipoMovimiento Tipo { get; set; }
    public required string Concepto { get; set; }
    public long Monto { get; set; }
    public string? Nota { get; set; }
}

/// <summary>Datos del negocio que salen en recibos y mensajes. Hay una sola fila.</summary>
public class Ajustes
{
    public int Id { get; set; }
    public string NombreNegocio { get; set; } = "Dulce Hogar JD";
    public string? Telefono { get; set; }
    public string? MensajeRecibo { get; set; } = "¡Gracias por su compra!";
}
