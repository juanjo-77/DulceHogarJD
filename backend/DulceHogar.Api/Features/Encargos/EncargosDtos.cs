using DulceHogar.Api.Common;
using DulceHogar.Api.Data;
using DulceHogar.Api.Entidades;
using Microsoft.EntityFrameworkCore;

namespace DulceHogar.Api.Features;

public record EncargoItemDto(int Id, int? ProductoId, string Descripcion, int Cantidad, long? PrecioVenta, int? Stock);

public record EncargoDto(
    int Id, ClienteMini Cliente, DateOnly FechaEntrega, int DiasRestantes, EstadoEncargo Estado, string? Notas,
    List<EncargoItemDto> Items, DateTime CreadoEn, int? VentaId, bool EnListaSurtir, string Descripcion);

public record EncargoItemInput(int? ProductoId, string? Descripcion, int Cantidad);
public record EncargoInput(int ClienteId, DateOnly FechaEntrega, string? Notas, List<EncargoItemInput> Items);
public record EstadoEncargoInput(EstadoEncargo Estado);

public static class EncargosMapeo
{
    public static IQueryable<Encargo> Consulta(AppDb db) =>
        db.Encargos.Include(e => e.Cliente).Include(e => e.Items).ThenInclude(i => i.Producto).AsSplitQuery();

    /// <summary>Ids de los pedidos que ya tienen algo anotado en la lista de surtir.</summary>
    public static async Task<HashSet<int>> EnListaAsync(AppDb db) =>
        (await db.PorTraer.Where(t => t.EncargoId != null && !t.Conseguido)
            .Select(t => t.EncargoId!.Value).Distinct().ToListAsync()).ToHashSet();

    public static EncargoDto ADto(Encargo e, DateOnly hoy, HashSet<int> enLista) => new(
        e.Id, VentasMapeo.AMini(e.Cliente)!, e.FechaEntrega, e.FechaEntrega.DayNumber - hoy.DayNumber, e.Estado, e.Notas,
        e.Items.OrderBy(i => i.Id)
            .Select(i => new EncargoItemDto(i.Id, i.ProductoId, i.Descripcion, i.Cantidad, i.Producto?.PrecioVenta, i.Producto?.Stock))
            .ToList(),
        e.CreadoEn, e.VentaId, enLista.Contains(e.Id),
        Texto.Articulos(e.Items.Select(i => (i.Descripcion, i.Cantidad))));
}
