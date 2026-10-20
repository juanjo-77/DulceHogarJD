namespace DulceHogar.Api.Features;

public static class ResumenEndpoints
{
    public static void MapResumen(this IEndpointRouteBuilder api)
    {
        var g = api.MapGroup("/resumen").WithTags("Resumen");

        g.MapGet("/hoy", (InicioServicio inicio) => inicio.CrearAsync());

        g.MapGet("/mes", (int? anio, int? mes, MesServicio servicio) => servicio.CrearAsync(anio, mes));
    }
}
