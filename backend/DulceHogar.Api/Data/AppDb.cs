using DulceHogar.Api.Entidades;
using Microsoft.EntityFrameworkCore;

namespace DulceHogar.Api.Data;

public class AppDb(DbContextOptions<AppDb> options) : DbContext(options)
{
    public DbSet<Categoria> Categorias => Set<Categoria>();
    public DbSet<Producto> Productos => Set<Producto>();
    public DbSet<Cliente> Clientes => Set<Cliente>();
    public DbSet<Venta> Ventas => Set<Venta>();
    public DbSet<VentaItem> VentaItems => Set<VentaItem>();
    public DbSet<Abono> Abonos => Set<Abono>();
    public DbSet<Devolucion> Devoluciones => Set<Devolucion>();
    public DbSet<Encargo> Encargos => Set<Encargo>();
    public DbSet<PorTraer> PorTraer => Set<PorTraer>();
    public DbSet<Proveedor> Proveedores => Set<Proveedor>();
    public DbSet<Surtido> Surtidos => Set<Surtido>();
    public DbSet<Movimiento> Movimientos => Set<Movimiento>();
    public DbSet<Ajustes> Ajustes => Set<Ajustes>();
    public DbSet<FotoProducto> Fotos => Set<FotoProducto>();

    protected override void ConfigureConventions(ModelConfigurationBuilder b)
    {
        // Las horas se guardan tal cual en hora de Colombia (ver Reloj), sin zona horaria.
        b.Properties<DateTime>().HaveColumnType("timestamp without time zone");
        b.Properties<DateTime?>().HaveColumnType("timestamp without time zone");

        // Enums como texto: la base de datos se puede leer a simple vista.
        b.Properties<TipoVenta>().HaveConversion<string>().HaveMaxLength(20);
        b.Properties<MetodoPago>().HaveConversion<string>().HaveMaxLength(20);
        b.Properties<EstadoEncargo>().HaveConversion<string>().HaveMaxLength(20);
        b.Properties<TipoMovimiento>().HaveConversion<string>().HaveMaxLength(20);
    }

    protected override void OnModelCreating(ModelBuilder m)
    {
        m.Entity<Categoria>(e =>
        {
            e.Property(x => x.Nombre).HasMaxLength(60);
            e.Property(x => x.Icono).HasMaxLength(16);
        });

        m.Entity<Producto>(e =>
        {
            e.Property(x => x.Nombre).HasMaxLength(120);
            e.HasIndex(x => x.Busqueda);
            e.HasOne(x => x.Categoria).WithMany(c => c.Productos).OnDelete(DeleteBehavior.Restrict);
        });

        m.Entity<Cliente>(e =>
        {
            e.Property(x => x.Nombre).HasMaxLength(120);
            e.HasIndex(x => x.Busqueda);
        });

        m.Entity<Venta>(e =>
        {
            e.Ignore(x => x.Saldo);
            e.HasIndex(x => x.Fecha);
            e.HasOne(x => x.Cliente).WithMany(c => c.Ventas).OnDelete(DeleteBehavior.Restrict);
            e.HasMany(x => x.Items).WithOne(i => i.Venta).OnDelete(DeleteBehavior.Cascade);
            e.HasMany(x => x.Abonos).WithOne(a => a.Venta).OnDelete(DeleteBehavior.Cascade);
            e.HasMany(x => x.Devoluciones).WithOne(d => d.Venta).OnDelete(DeleteBehavior.Cascade);
        });

        m.Entity<VentaItem>().HasOne(x => x.Producto).WithMany().OnDelete(DeleteBehavior.Restrict);
        m.Entity<Abono>().HasIndex(x => x.Fecha);

        m.Entity<DevolucionItem>().HasOne(x => x.VentaItem).WithMany().OnDelete(DeleteBehavior.Restrict);

        m.Entity<Encargo>(e =>
        {
            e.HasOne(x => x.Cliente).WithMany().OnDelete(DeleteBehavior.Restrict);
            e.HasMany(x => x.Items).WithOne().HasForeignKey(i => i.EncargoId).OnDelete(DeleteBehavior.Cascade);
        });
        m.Entity<EncargoItem>().HasOne(x => x.Producto).WithMany().OnDelete(DeleteBehavior.SetNull);

        m.Entity<PorTraer>(e =>
        {
            e.HasOne(x => x.Producto).WithMany().OnDelete(DeleteBehavior.Cascade);
            e.HasOne(x => x.Encargo).WithMany().OnDelete(DeleteBehavior.SetNull);
        });

        m.Entity<Proveedor>().HasIndex(x => x.Busqueda);

        m.Entity<Surtido>(e =>
        {
            e.HasIndex(x => x.Fecha);
            e.HasOne(x => x.Proveedor).WithMany().OnDelete(DeleteBehavior.SetNull);
            e.HasMany(x => x.Items).WithOne().HasForeignKey(i => i.SurtidoId).OnDelete(DeleteBehavior.Cascade);
        });
        m.Entity<SurtidoItem>().HasOne(x => x.Producto).WithMany().OnDelete(DeleteBehavior.Restrict);

        m.Entity<Movimiento>().HasIndex(x => x.Fecha);
        m.Entity<FotoProducto>().HasIndex(x => x.ProductoId);
    }
}
