using CoolStay.Api.Data;
using CoolStay.Api.DTOs.Booking;
using CoolStay.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace CoolStay.Api.Services;

public class BookingService(AppDbContext db)
{
    public async Task<IEnumerable<BookingResponse>> GetUserBookingsAsync(Guid userId)
    {
        return await db.Bookings
            .Include(b => b.Property)
            .Include(b => b.Guest)
            .Where(b => b.GuestId == userId)
            .OrderByDescending(b => b.CreatedAt)
            .Select(b => MapToResponse(b))
            .ToListAsync();
    }

    public async Task<IEnumerable<BookingResponse>> GetHostBookingsAsync(Guid hostId)
    {
        return await db.Bookings
            .Include(b => b.Property)
            .Include(b => b.Guest)
            .Where(b => b.Property.HostId == hostId)
            .OrderByDescending(b => b.CreatedAt)
            .Select(b => MapToResponse(b))
            .ToListAsync();
    }

    public async Task<BookingResponse> CreateAsync(CreateBookingRequest req, Guid guestId)
    {
        if (req.CheckIn >= req.CheckOut)
            throw new ArgumentException("Check-out must be after check-in.");

        if (req.CheckIn < DateTime.UtcNow.Date)
            throw new ArgumentException("Check-in cannot be in the past.");

        var property = await db.Properties.FindAsync(req.PropertyId)
            ?? throw new KeyNotFoundException("Property not found.");

        if (!property.IsActive)
            throw new InvalidOperationException("Property is not available.");

        var conflict = await db.Bookings.AnyAsync(b =>
            b.PropertyId == req.PropertyId &&
            b.Status == "confirmed" &&
            b.CheckIn < req.CheckOut &&
            b.CheckOut > req.CheckIn);

        if (conflict)
            throw new InvalidOperationException("Property is not available for the selected dates.");

        var nights = (req.CheckOut - req.CheckIn).Days;
        var booking = new Booking
        {
            PropertyId = req.PropertyId,
            GuestId = guestId,
            CheckIn = req.CheckIn,
            CheckOut = req.CheckOut,
            TotalPrice = property.PricePerNight * nights
        };

        db.Bookings.Add(booking);
        await db.SaveChangesAsync();
        await db.Entry(booking).Reference(b => b.Property).LoadAsync();
        await db.Entry(booking).Reference(b => b.Guest).LoadAsync();
        return MapToResponse(booking);
    }

    public async Task CancelAsync(Guid id, Guid userId)
    {
        var booking = await db.Bookings.FindAsync(id)
            ?? throw new KeyNotFoundException("Booking not found.");

        if (booking.GuestId != userId)
            throw new UnauthorizedAccessException("Not your booking.");

        if (booking.Status == "cancelled")
            throw new InvalidOperationException("Booking is already cancelled.");

        booking.Status = "cancelled";
        await db.SaveChangesAsync();
    }

    private static BookingResponse MapToResponse(Booking b) => new(
        b.Id, b.PropertyId, b.Property.Title, b.Property.City, b.Property.ImageUrl,
        b.GuestId, $"{b.Guest.FirstName} {b.Guest.LastName}",
        b.CheckIn, b.CheckOut, b.TotalPrice, b.Status, b.CreatedAt
    );
}
