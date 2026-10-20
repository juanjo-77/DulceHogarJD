using ClosedXML.Excel;

namespace DulceHogar.Api.Features;

public static class HojaExcel
{
    public static void Agregar(XLWorkbook libro, string nombre, string[] encabezados, IEnumerable<object?[]> filas)
    {
        var hoja = libro.Worksheets.Add(nombre);
        for (var c = 0; c < encabezados.Length; c++)
        {
            var celda = hoja.Cell(1, c + 1);
            celda.Value = encabezados[c];
            celda.Style.Font.Bold = true;
            celda.Style.Fill.BackgroundColor = XLColor.FromHtml("#F8DDE4");
        }

        var f = 2;
        foreach (var fila in filas)
        {
            for (var c = 0; c < fila.Length; c++) Escribir(hoja.Cell(f, c + 1), fila[c]);
            f++;
        }
        hoja.SheetView.FreezeRows(1);
        hoja.Columns().AdjustToContents(1, Math.Min(f, 200));
    }

    private static void Escribir(IXLCell celda, object? valor)
    {
        switch (valor)
        {
            case null: break;
            case long n: celda.Value = n; celda.Style.NumberFormat.Format = "#,##0"; break;
            case int n: celda.Value = n; break;
            case DateTime d: celda.Value = d; celda.Style.DateFormat.Format = "dd/mm/yyyy hh:mm"; break;
            default: celda.Value = valor.ToString(); break;
        }
    }
}
