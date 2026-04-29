using CoolStay.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace CoolStay.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();
    public DbSet<Property> Properties => Set<Property>();
    public DbSet<Booking> Bookings => Set<Booking>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>(e =>
        {
            e.HasIndex(u => u.Email).IsUnique();
        });

        modelBuilder.Entity<Property>(e =>
        {
            e.Property(p => p.PricePerNight).HasColumnType("decimal(18,2)");
            e.HasOne(p => p.Host).WithMany(u => u.Properties).HasForeignKey(p => p.HostId).OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Booking>(e =>
        {
            e.Property(b => b.TotalPrice).HasColumnType("decimal(18,2)");
            e.HasOne(b => b.Property).WithMany(p => p.Bookings).HasForeignKey(b => b.PropertyId).OnDelete(DeleteBehavior.Restrict);
            e.HasOne(b => b.Guest).WithMany(u => u.Bookings).HasForeignKey(b => b.GuestId).OnDelete(DeleteBehavior.Restrict);
        });
    }
}
