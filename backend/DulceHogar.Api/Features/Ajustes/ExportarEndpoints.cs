using DulceHogar.Api.Common;

namespace DulceHogar.Api.Features;

/// <summary>
/// Exportar todo a Excel. Las copias de seguridad de la base de datos las hace Neon
/// (historial y restauración a un momento anterior).
/// </summary>
public static class ExportarEndpoints
{
    private const string TipoExcel = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

    public static void MapExportar(this IEndpointRouteBuilder api)
    {
        api.MapGet("/exportar/excel", async (ExcelServicio excel, Reloj reloj) =>
            Results.File(await excel.CrearAsync(), TipoExcel, $"dulce-hogar-{reloj.Hoy:yyyy-MM-dd}.xlsx")).WithTags("Ajustes");
    }
}
