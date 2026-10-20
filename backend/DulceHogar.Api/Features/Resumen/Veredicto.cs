using DulceHogar.Api.Common;

namespace DulceHogar.Api.Features;

/// <summary>
/// Traduce los números del mes a una frase que se entienda sin saber de contabilidad.
/// La ganancia ya se muestra en grande en la app, así que el mensaje aporta la comparación.
/// </summary>
public static class Veredicto
{
    public static VeredictoDto Crear(CifrasMes actual, CifrasMes anterior, string mesAnterior, bool esActual, long porCobrar)
    {
        var ganancia = actual.Ganancia;
        var antes = anterior.Ganancia;
        var comparacion = antes > 0
            ? $"En {mesAnterior} ganaste {Texto.Pesos(antes)} en total."
            : "Estás ganando más de lo que gastas.";

        var v = true switch
        {
            _ when actual.Ventas.Count == 0 => new VeredictoDto("sinDatos",
                "Todavía no hay ventas este mes", "Cuando registres ventas, aquí verás cómo va tu negocio."),

            _ when ganancia <= 0 => new VeredictoDto("mal",
                "Este mes el negocio no está dejando ganancia",
                "Lo que costó la mercancía más los gastos es mayor que lo que vendiste. Revisa los gastos o los precios de venta."),

            _ when antes > 0 && ganancia >= antes * 11 / 10 => new VeredictoDto("excelente",
                "¡El negocio va muy bien!",
                $"Es {Texto.Pesos(ganancia - antes)} más que en {mesAnterior}. ¡Sigue así!"),

            // Un mes que va a la mitad no se compara contra uno completo.
            _ when esActual => new VeredictoDto("bien", "El negocio va bien", $"El mes todavía no termina. {comparacion}"),

            _ when antes <= 0 || ganancia >= antes * 9 / 10 => new VeredictoDto("bien", "El negocio va bien", comparacion),

            _ => new VeredictoDto("regular",
                $"Vas bien, pero un poco por debajo de {mesAnterior}", comparacion),
        };

        if (actual.Vendido > 0 && porCobrar > actual.Vendido / 2)
            v = v with { Mensaje = $"{v.Mensaje} Te deben {Texto.Pesos(porCobrar)}: cobrar a tiempo te deja plata para surtir." };
        return v;
    }
}
