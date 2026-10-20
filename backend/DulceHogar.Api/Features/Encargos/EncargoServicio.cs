using DulceHogar.Api.Common;
using DulceHogar.Api.Data;
using DulceHogar.Api.Entidades;
using Microsoft.EntityFrameworkCore;

namespace DulceHogar.Api.Features;

public sealed class EncargoServicio(AppDb db, Reloj reloj)
{
    public async Task AplicarAsync(Encargo e, EncargoInput input)
    {
        Regla.Cumplir(await db.Clientes.AnyAsync(c => c.Id == input.ClienteId && c.Activo), "Elige de quién es el pedido.");
        Regla.Cumplir(input.Items is { Count: > 0 }, "Agrega al menos un producto al pedido.");

        var ids = input.Items.Where(i => i.ProductoId != null).Select(i => i.ProductoId!.Value).ToList();
        var productos = await db.Productos.Where(p => ids.Contains(p.Id)).ToDictionaryAsync(p => p.Id);

        var items = new List<EncargoItem>();
        foreach (var i in input.Items)
        {
            Regla.Cumplir(i.Cantidad > 0, "Las cantidades deben ser mayores que cero.");
            var producto = i.ProductoId is { } pid ? Regla.Existe(productos.GetValueOrDefault(pid), "uno de los productos") : null;
            var descripcion = producto?.Nombre ?? Texto.Limpiar(i.Descripcion);
            Regla.Cumplir(descripcion is not null, "Escribe qué producto pidió.");
            items.Add(new EncargoItem { ProductoId = producto?.Id, Descripcion = descripcion!, Cantidad = i.Cantidad });
        }

        e.ClienteId = input.ClienteId;
        e.FechaEntrega = input.FechaEntrega;
        e.Notas = Texto.Limpiar(input.Notas);
        e.Items.Clear();
        e.Items.AddRange(items);
    }

    /// <summary>Anota en la lista de surtir lo que falta en inventario para cumplir el pedido.</summary>
    public async Task<int> PasarALaListaAsync(Encargo e)
    {
        var yaAnotados = await db.PorTraer.Where(t => t.EncargoId == e.Id && !t.Conseguido).Select(t => t.Descripcion).ToListAsync();
        var agregados = 0;
        foreach (var item in e.Items.Where(i => !yaAnotados.Contains(i.Descripcion)))
        {
            var faltan = item.Producto is null ? item.Cantidad : item.Cantidad - Math.Max(item.Producto.Stock, 0);
            if (faltan <= 0) continue;
            db.PorTraer.Add(new PorTraer
            {
                ProductoId = item.ProductoId, Descripcion = item.Descripcion, Cantidad = faltan,
                EncargoId = e.Id, CreadoEn = reloj.Ahora, Nota = $"Pedido de {e.Cliente!.Nombre}",
            });
            agregados++;
        }
        Regla.Cumplir(agregados > 0 || yaAnotados.Count > 0, "Ya tienes en el inventario todo lo de este pedido.");
        await db.SaveChangesAsync();
        return agregados;
    }
}
