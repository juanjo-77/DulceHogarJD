namespace DulceHogar.Api.Entidades;

public enum TipoVenta { Contado, Fiado, Separe }

public enum MetodoPago { Efectivo, Transferencia }

public enum EstadoEncargo { Pendiente, Listo, Entregado, Cancelado }

public enum TipoMovimiento { Gasto, Ingreso }

/// <summary>Estado de una venta visto desde lo que le importa a la dueña: ¿le deben, ya pagaron, falta entregar?</summary>
public enum EstadoCuenta { Debe, Vencida, ParaEntregar, AlDia, Anulada }
