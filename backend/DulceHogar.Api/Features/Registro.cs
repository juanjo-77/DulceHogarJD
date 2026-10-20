namespace DulceHogar.Api.Features;

/// <summary>Un solo lugar donde se registran todos los servicios y rutas de la API.</summary>
public static class Registro
{
    public static IServiceCollection AddServicios(this IServiceCollection s) => s
        .AddScoped<InventarioServicio>()
        .AddScoped<VentaServicio>()
        .AddScoped<DevolucionServicio>()
        .AddScoped<ReciboServicio>()
        .AddScoped<EncargoServicio>()
        .AddScoped<SurtidoServicio>()
        .AddScoped<CajaServicio>()
        .AddScoped<InicioServicio>()
        .AddScoped<MesServicio>()
        .AddScoped<ExcelServicio>();

    public static void MapEndpoints(this IEndpointRouteBuilder api)
    {
        api.MapCategorias();
        api.MapProductos();
        api.MapFotos();
        api.MapClientes();
        api.MapVentas();
        api.MapAbonos();
        api.MapDevoluciones();
        api.MapEncargos();
        api.MapListaSurtir();
        api.MapProveedores();
        api.MapSurtidos();
        api.MapCaja();
        api.MapResumen();
        api.MapAjustes();
        api.MapExportar();
    }
}
