using DulceHogar.Api.Common;
using DulceHogar.Api.Entidades;
using Microsoft.EntityFrameworkCore;

namespace DulceHogar.Api.Data;

/// <summary>
/// Datos de ejemplo para probar la app (Demo:Seed = true). Nunca se cargan sobre datos reales:
/// solo corren si no hay ningún producto.
/// </summary>
public static partial class SemillaDemo
{
    private static readonly (string Categoria, string Nombre, long Compra, long Venta, int Stock, int Minimo)[] Catalogo =
    [
        ("Almohadas", "Almohada fibra siliconada", 18_000, 35_000, 12, 3),
        ("Almohadas", "Almohada viscoelástica", 45_000, 85_000, 2, 2),
        ("Almohadas", "Almohada para bebé", 12_000, 25_000, 6, 2),
        ("Cobijas", "Cobija ovejera doble", 55_000, 95_000, 5, 2),
        ("Cobijas", "Cobija térmica sencilla", 30_000, 55_000, 0, 2),
        ("Cobijas", "Cobija estampada infantil", 28_000, 48_000, 4, 2),
        ("Sábanas", "Juego de sábanas doble", 48_000, 85_000, 7, 2),
        ("Sábanas", "Juego de sábanas sencillo", 32_000, 58_000, 1, 2),
        ("Sábanas", "Sábana ajustable queen", 38_000, 68_000, 4, 2),
        ("Toallas", "Toalla de baño grande", 22_000, 39_000, 15, 4),
        ("Toallas", "Toalla de manos", 7_000, 14_000, 20, 5),
        ("Toallas", "Juego de toallas x3", 45_000, 79_000, 3, 1),
        ("Cortinas", "Cortina blackout 2 paños", 60_000, 110_000, 2, 1),
        ("Cortinas", "Cortina de baño", 18_000, 32_000, 6, 2),
        ("Cubrelechos", "Cubrelecho doble reversible", 85_000, 150_000, 3, 1),
        ("Cubrelechos", "Edredón queen", 120_000, 210_000, 1, 1),
        ("Manteles", "Mantel antifluido 6 puestos", 25_000, 45_000, 5, 2),
        ("Otros", "Tapete de baño", 9_000, 18_000, 10, 3),
    ];

    private static readonly (string Nombre, string Telefono, string? Direccion)[] Clientes =
    [
        ("María Gómez", "3001234567", "Barrio La Esperanza, calle 12 #4-20"),
        ("Luz Marina Ríos", "3109876543", null),
        ("Rosa Elena Pérez", "3204567890", "Vereda El Carmen"),
        ("Carmen Ortiz", "3157654321", null),
        ("Patricia Salazar", "3012345678", "Conjunto Los Pinos, casa 8"),
        ("Gloria Torres", "3178901234", null),
        ("Ana Lucía Castro", "3145678901", null),
        ("Martha Cecilia Vargas", "3186543210", "Frente al parque principal"),
    ];

    public static async Task CargarAsync(AppDb db, Reloj reloj)
    {
        var hoy = reloj.Hoy;
        var azar = new Random(2026);
        var categorias = await db.Categorias.ToDictionaryAsync(c => c.Nombre);

        var productos = Catalogo.Select(p => new Producto
        {
            Nombre = p.Nombre, Busqueda = Texto.Normalizar(p.Nombre), CategoriaId = categorias[p.Categoria].Id,
            PrecioCompra = p.Compra, PrecioVenta = p.Venta, Stock = p.Stock, StockMinimo = p.Minimo,
            CreadoEn = hoy.AddDays(-150).ToDateTime(new TimeOnly(9, 0)),
        }).ToList();
        var clientes = Clientes.Select(c => new Cliente
        {
            Nombre = c.Nombre, Busqueda = Texto.Normalizar(c.Nombre), Telefono = c.Telefono, Direccion = c.Direccion,
            CreadoEn = hoy.AddDays(-140).ToDateTime(new TimeOnly(10, 0)),
        }).ToList();
        db.Productos.AddRange(productos);
        db.Clientes.AddRange(clientes);

        var encargos = Encargos(productos, clientes, hoy);
        db.Ventas.AddRange(Ventas(productos, clientes, reloj.Ahora, azar));
        db.Ventas.AddRange(CuentasAbiertas(productos, clientes, hoy));
        db.Encargos.AddRange(encargos);
        db.PorTraer.AddRange(ListaSurtir(productos, encargos, hoy));
        db.Surtidos.AddRange(Surtidos(productos, hoy, azar));
        db.Movimientos.AddRange(Gastos(reloj.Ahora));
        await db.SaveChangesAsync();
    }

    private static DateTime A(DateOnly dia, int hora, int minuto = 0) => dia.ToDateTime(new TimeOnly(hora, minuto));
}
