namespace DulceHogar.Api.Entidades;

public class Venta
{
    public int Id { get; set; }
    public int? ClienteId { get; set; }
    public Cliente? Cliente { get; set; }
    public DateTime Fecha { get; set; }
    public TipoVenta Tipo { get; set; }
    /// <summary>Fiado: fecha acordada de pago. Separe: fecha límite para completar las cuotas.</summary>
    public DateOnly? FechaLimite { get; set; }
    public bool Entregada { get; set; }
    public DateTime? EntregadaEn { get; set; }
    public bool Anulada { get; set; }
    public string? Notas { get; set; }
    public int? EncargoId { get; set; }

    // Totales guardados para poder filtrar "quién me debe" directamente en la base de datos.
    // Se actualizan siempre con Recalcular().
    public long Total { get; set; }
    public long Pagado { get; set; }

    public List<VentaItem> Items { get; set; } = [];
    public List<Abono> Abonos { get; set; } = [];
    public List<Devolucion> Devoluciones { get; set; } = [];

    public long Saldo => Total - Pagado;

    public void Recalcular()
    {
        Total = Items.Sum(i => (long)(i.Cantidad - i.CantidadDevuelta) * i.PrecioUnitario);
        Pagado = Abonos.Sum(a => a.Monto) - Devoluciones.Sum(d => d.MontoReembolsado);
    }

    public EstadoCuenta Estado(DateOnly hoy)
    {
        if (Anulada) return EstadoCuenta.Anulada;
        if (Saldo > 0) return FechaLimite is { } limite && limite < hoy ? EstadoCuenta.Vencida : EstadoCuenta.Debe;
        if (Tipo == TipoVenta.Separe && !Entregada) return EstadoCuenta.ParaEntregar;
        return EstadoCuenta.AlDia;
    }
}

public class VentaItem
{
    public int Id { get; set; }
    public int VentaId { get; set; }
    public Venta? Venta { get; set; }
    public int ProductoId { get; set; }
    public Producto? Producto { get; set; }
    /// <summary>Copia del nombre al momento de vender, por si luego cambia.</summary>
    public required string Nombre { get; set; }
    public int Cantidad { get; set; }
    public int CantidadDevuelta { get; set; }
    public long PrecioUnitario { get; set; }
    /// <summary>Lo que costó la mercancía al momento de vender: base de la ganancia.</summary>
    public long CostoUnitario { get; set; }
}

public class Abono
{
    public int Id { get; set; }
    public int VentaId { get; set; }
    public Venta? Venta { get; set; }
    public DateTime Fecha { get; set; }
    public long Monto { get; set; }
    public MetodoPago Metodo { get; set; }
    public string? Nota { get; set; }
}
