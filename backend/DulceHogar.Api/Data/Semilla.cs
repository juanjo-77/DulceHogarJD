using DulceHogar.Api.Entidades;
using Microsoft.EntityFrameworkCore;

namespace DulceHogar.Api.Data;

/// <summary>Prepara la base de datos al arrancar: aplica migraciones y crea lo mínimo para empezar.</summary>
public static class Semilla
{
    private static readonly (string Nombre, string Icono)[] Categorias =
    [
        ("Almohadas", "☁️"), ("Cobijas", "🧶"), ("Sábanas", "🛏️"), ("Toallas", "🛁"),
        ("Cortinas", "🪟"), ("Cubrelechos", "🌸"), ("Manteles", "🍽️"), ("Otros", "🎁"),
    ];

    public static async Task PrepararAsync(IServiceProvider servicios, bool conDatosDeEjemplo)
    {
        var db = servicios.GetRequiredService<AppDb>();
        await db.Database.MigrateAsync();

        // El WhatsApp del negocio (Negocio:Telefono) sale en recibos y estados de cuenta.
        // Solo se pone si no hay uno guardado: si lo cambian desde la app, se respeta.
        var telefono = Common.Texto.Limpiar(servicios.GetRequiredService<IConfiguration>()["Negocio:Telefono"]);
        var ajustes = await db.Ajustes.OrderBy(a => a.Id).FirstOrDefaultAsync();
        if (ajustes is null) db.Ajustes.Add(new Ajustes { Telefono = telefono });
        else if (ajustes.Telefono is null) ajustes.Telefono = telefono;

        if (!await db.Categorias.AnyAsync())
            db.Categorias.AddRange(Categorias.Select((c, i) => new Categoria { Nombre = c.Nombre, Icono = c.Icono, Orden = i + 1 }));

        await db.SaveChangesAsync();

        if (conDatosDeEjemplo && !await db.Productos.AnyAsync())
            await SemillaDemo.CargarAsync(db, servicios.GetRequiredService<Common.Reloj>());
    }
}
