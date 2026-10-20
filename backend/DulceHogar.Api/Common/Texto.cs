using System.Globalization;
using System.Text;

namespace DulceHogar.Api.Common;

public static class Texto
{
    private static readonly CultureInfo Colombia = CultureInfo.GetCultureInfo("es-CO");

    /// <summary>"  Sábana Doble " → "sabana doble". Para buscar sin importar tildes ni mayúsculas.</summary>
    public static string Normalizar(string? texto)
    {
        if (string.IsNullOrWhiteSpace(texto)) return "";
        var sinTildes = new StringBuilder();
        foreach (var c in texto.Trim().ToLowerInvariant().Normalize(NormalizationForm.FormD))
            if (CharUnicodeInfo.GetUnicodeCategory(c) != UnicodeCategory.NonSpacingMark) sinTildes.Append(c);
        return sinTildes.ToString().Normalize(NormalizationForm.FormC);
    }

    public static string? Limpiar(string? texto) => string.IsNullOrWhiteSpace(texto) ? null : texto.Trim();

    public static string? SoloDigitos(string? texto)
    {
        var digitos = new string((texto ?? "").Where(char.IsDigit).ToArray());
        return digitos.Length == 0 ? null : digitos;
    }

    /// <summary>Con espacio que no se parte: el "$" nunca queda solo al final de un renglón.</summary>
    public static string Pesos(long valor) => "$ " + valor.ToString("#,0", Colombia);

    public static string NombreMes(int mes) => Colombia.DateTimeFormat.GetMonthName(mes);

    public static string MesCorto(int mes) => Colombia.DateTimeFormat.GetAbbreviatedMonthName(mes).TrimEnd('.');

    /// <summary>Resume artículos: "2 × Cobija doble, Toalla grande".</summary>
    public static string Articulos(IEnumerable<(string Nombre, int Cantidad)> items)
    {
        var partes = items.Where(i => i.Cantidad > 0)
            .Select(i => i.Cantidad == 1 ? i.Nombre : $"{i.Cantidad} × {i.Nombre}")
            .ToList();
        return partes.Count == 0 ? "Sin artículos" : string.Join(", ", partes);
    }
}
