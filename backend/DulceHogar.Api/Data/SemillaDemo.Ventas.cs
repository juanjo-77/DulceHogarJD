using DulceHogar.Api.Entidades;

namespace DulceHogar.Api.Data;

public static partial class SemillaDemo
{
    /// <summary>Cuatro meses de ventas cerradas: sobre todo de contado y algunos fiados ya pagos.</summary>
    private static IEnumerable<Venta> Ventas(List<Producto> productos, List<Cliente> clientes, DateTime ahora, Random azar)
    {
        var hoy = DateOnly.FromDateTime(ahora);
        for (var d = -120; d <= 0; d++)
        {
            var dia = hoy.AddDays(d);
            var cuantas = azar.Next(0, d > -25 ? 4 : 3);
            for (var n = 0; n < cuantas; n++)
            {
                var fecha = A(dia, 9 + azar.Next(0, 9), azar.Next(0, 60));
                if (fecha > ahora) continue;

                var fiado = d < -35 && azar.Next(0, 6) == 0;
                var venta = new Venta
                {
                    Fecha = fecha, Tipo = fiado ? TipoVenta.Fiado : TipoVenta.Contado, Entregada = true, EntregadaEn = fecha,
                    Cliente = fiado || azar.Next(0, 3) == 0 ? clientes[azar.Next(clientes.Count)] : null,
                    FechaLimite = fiado ? dia.AddDays(30) : null,
                };
                venta.Items.AddRange(Items(productos, azar));
                venta.Recalcular();

                var metodo = azar.Next(0, 4) == 0 ? MetodoPago.Transferencia : MetodoPago.Efectivo;
                if (fiado)
                {
                    var mitad = venta.Total / 2;
                    venta.Abonos.Add(new Abono { Fecha = fecha.AddDays(8), Monto = mitad, Metodo = metodo });
                    venta.Abonos.Add(new Abono { Fecha = fecha.AddDays(22), Monto = venta.Total - mitad, Metodo = metodo });
                }
                else
                {
                    venta.Abonos.Add(new Abono { Fecha = fecha, Monto = venta.Total, Metodo = metodo });
                }
                venta.Recalcular();
                yield return venta;
            }
        }
    }

    private static IEnumerable<VentaItem> Items(List<Producto> productos, Random azar)
    {
        var cuantos = azar.Next(0, 10) < 3 ? 2 : 1;
        return productos.OrderBy(_ => azar.Next()).Take(cuantos).Select(p => Item(p, azar.Next(0, 5) == 0 ? 2 : 1));
    }

    private static VentaItem Item(Producto p, int cantidad) => new()
    {
        Producto = p, Nombre = p.Nombre, Cantidad = cantidad, PrecioUnitario = p.PrecioVenta, CostoUnitario = p.PrecioCompra,
    };

    /// <summary>Fiados y planes separe abiertos, armados para que se vean todos los casos de la app.</summary>
    private static IEnumerable<Venta> CuentasAbiertas(List<Producto> productos, List<Cliente> clientes, DateOnly hoy)
    {
        Producto P(string nombre) => productos.First(p => p.Nombre == nombre);
        Cliente C(string nombre) => clientes.First(c => c.Nombre == nombre);

        Venta Cuenta(string cliente, TipoVenta tipo, int hace, int limite, (string Producto, int Cantidad)[] items, params (int Hace, long Monto)[] abonos)
        {
            var v = new Venta
            {
                Cliente = C(cliente), Tipo = tipo, Fecha = A(hoy.AddDays(-hace), 11), FechaLimite = hoy.AddDays(limite),
                Entregada = tipo == TipoVenta.Fiado, EntregadaEn = tipo == TipoVenta.Fiado ? A(hoy.AddDays(-hace), 11) : null,
            };
            v.Items.AddRange(items.Select(i => Item(P(i.Producto), i.Cantidad)));
            v.Abonos.AddRange(abonos.Select(a => new Abono { Fecha = A(hoy.AddDays(-a.Hace), 10), Monto = a.Monto, Metodo = MetodoPago.Efectivo }));
            v.Recalcular();
            return v;
        }

        yield return Cuenta("María Gómez", TipoVenta.Fiado, 40, -10, [("Cobija ovejera doble", 1), ("Toalla de baño grande", 1)], (30, 50_000));
        yield return Cuenta("Rosa Elena Pérez", TipoVenta.Separe, 25, 35, [("Cubrelecho doble reversible", 1)], (25, 50_000), (10, 40_000));
        yield return Cuenta("Patricia Salazar", TipoVenta.Separe, 45, 15, [("Juego de sábanas doble", 1), ("Almohada fibra siliconada", 2)], (45, 55_000), (20, 50_000), (2, 50_000));
        yield return Cuenta("Gloria Torres", TipoVenta.Fiado, 28, 2, [("Juego de toallas x3", 1)], (14, 30_000));
        yield return Cuenta("Carmen Ortiz", TipoVenta.Fiado, 10, 20, [("Cortina blackout 2 paños", 1)]);
        yield return Cuenta("Luz Marina Ríos", TipoVenta.Separe, 5, 55, [("Edredón queen", 1)], (5, 60_000));
    }
}
