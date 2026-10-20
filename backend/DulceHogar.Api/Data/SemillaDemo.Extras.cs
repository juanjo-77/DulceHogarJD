using DulceHogar.Api.Common;
using DulceHogar.Api.Entidades;

namespace DulceHogar.Api.Data;

public static partial class SemillaDemo
{
    private static List<Encargo> Encargos(List<Producto> productos, List<Cliente> clientes, DateOnly hoy)
    {
        Producto P(string nombre) => productos.First(p => p.Nombre == nombre);
        Cliente C(string nombre) => clientes.First(c => c.Nombre == nombre);
        EncargoItem Item(Producto p, int cantidad) => new() { Producto = p, Descripcion = p.Nombre, Cantidad = cantidad };

        return
        [
            new Encargo
            {
                Cliente = C("Ana Lucía Castro"), FechaEntrega = hoy.AddDays(1), Estado = EstadoEncargo.Pendiente,
                CreadoEn = A(hoy.AddDays(-6), 15), Notas = "La de Spiderman es para el nieto",
                Items = [Item(P("Toalla de manos"), 2), new EncargoItem { Descripcion = "Cobija de Spiderman para niño", Cantidad = 1 }],
            },
            new Encargo
            {
                Cliente = C("Martha Cecilia Vargas"), FechaEntrega = hoy.AddDays(5), Estado = EstadoEncargo.Pendiente,
                CreadoEn = A(hoy.AddDays(-3), 16), Items = [Item(P("Cobija térmica sencilla"), 2)],
            },
            new Encargo
            {
                Cliente = C("Luz Marina Ríos"), FechaEntrega = hoy.AddDays(-1), Estado = EstadoEncargo.Listo,
                CreadoEn = A(hoy.AddDays(-9), 11), Items = [Item(P("Juego de sábanas sencillo"), 1)],
            },
        ];
    }

    private static IEnumerable<PorTraer> ListaSurtir(List<Producto> productos, List<Encargo> encargos, DateOnly hoy)
    {
        Producto P(string nombre) => productos.First(p => p.Nombre == nombre);
        var creado = A(hoy.AddDays(-1), 18);

        yield return new PorTraer { Producto = P("Cobija térmica sencilla"), Descripcion = "Cobija térmica sencilla", Cantidad = 4, Nota = "Agotado", CreadoEn = creado };
        yield return new PorTraer { Descripcion = "Cobija de Spiderman para niño", Cantidad = 1, Encargo = encargos[0], Nota = "Pedido de Ana Lucía Castro", CreadoEn = creado };
        yield return new PorTraer { Producto = P("Almohada viscoelástica"), Descripcion = "Almohada viscoelástica", Cantidad = 3, Conseguido = true, CreadoEn = creado };
    }

    private static IEnumerable<Surtido> Surtidos(List<Producto> productos, DateOnly hoy, Random azar)
    {
        Proveedor[] proveedores =
        [
            new() { Nombre = "Textiles Medellín", Busqueda = Texto.Normalizar("Textiles Medellín"), Telefono = "3041234567" },
            new() { Nombre = "Distribuidora El Hogar", Busqueda = Texto.Normalizar("Distribuidora El Hogar") },
            new() { Nombre = "Toallas Pereira", Busqueda = Texto.Normalizar("Toallas Pereira") },
        ];

        for (var d = -118; d < -3; d += 15)
        {
            var proveedor = proveedores[azar.Next(proveedores.Length)];
            var s = new Surtido { Fecha = A(hoy.AddDays(d), 8, 30), Proveedor = proveedor, ProveedorNombre = proveedor.Nombre };
            s.Items.AddRange(productos.OrderBy(_ => azar.Next()).Take(azar.Next(3, 5)).Select(p => new SurtidoItem
            {
                Producto = p, Nombre = p.Nombre, Cantidad = azar.Next(3, 9), CostoUnitario = p.PrecioCompra,
            }));
            s.Total = s.Items.Sum(i => i.Cantidad * i.CostoUnitario);
            yield return s;
        }
    }

    private static IEnumerable<Movimiento> Gastos(DateTime ahora)
    {
        var hoy = DateOnly.FromDateTime(ahora);
        for (var m = -4; m <= 0; m++)
        {
            var mes = new DateOnly(hoy.Year, hoy.Month, 1).AddMonths(m);
            (int Dia, string Concepto, long Monto)[] fijos =
                [(5, "Arriendo del local", 600_000), (15, "Servicios (luz y agua)", 120_000), (10, "Bolsas y empaques", 40_000), (20, "Transporte", 30_000)];
            foreach (var (dia, concepto, monto) in fijos)
            {
                var fecha = A(mes.AddDays(dia - 1), 12);
                if (fecha <= ahora) yield return new Movimiento { Fecha = fecha, Tipo = TipoMovimiento.Gasto, Concepto = concepto, Monto = monto };
            }
        }
    }
}
