namespace DulceHogar.Api.Features;

/// <summary>Nivel: 0 = informativo, 1 = atención, 2 = urgente.</summary>
public record AlertaDto(string Clave, string Tipo, int Nivel, string Titulo, string Detalle, string Ruta);

public record InicioDto(
    long VendidoHoy, int VentasHoy, long EntroHoy, long SalioHoy, long PorCobrar, int PersonasQueDeben,
    int Agotados, int Pocos, int PedidosPendientes, int PorTraer, List<AlertaDto> Alertas);

public record MesPuntoDto(int Anio, int Mes, string Etiqueta, long Vendido, long Ganancia);
public record TopProductoDto(int ProductoId, string Nombre, int Unidades, long Vendido);
public record VeredictoDto(string Nivel, string Titulo, string Mensaje);

public record MesDto(
    int Anio, int Mes, string NombreMes, bool EsMesActual,
    long Vendido, int NumeroVentas, long CostoMercancia, long GananciaBruta, long Gastos, long OtrosIngresos, long Ganancia,
    int Margen, long DineroQueEntro, long ComprasSurtido, long PorCobrar,
    long VendidoContado, long VendidoFiado, long VendidoSepare,
    long GananciaMesAnterior, long VendidoMesAnterior, string NombreMesAnterior,
    VeredictoDto Veredicto, List<MesPuntoDto> Tendencia, List<TopProductoDto> TopProductos, List<MovimientoDto> GastosDelMes);
