using CoolStay.Api.Data;
using CoolStay.Api.DTOs.Property;
using CoolStay.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace CoolStay.Api.Services;

public class PropertyService(AppDbContext db)
{
    public async Task<IEnumerable<PropertyResponse>> SearchAsync(string? city, int? guests)
    {
        var query = db.Properties.Include(p => p.Host).Where(p => p.IsActive);

        if (!string.IsNullOrWhiteSpace(city))
            query = query.Where(p => p.City.ToLower().Contains(city.ToLower()));

        if (guests.HasValue)
            query = query.Where(p => p.MaxGuests >= guests.Value);

        return await query.OrderByDescending(p => p.CreatedAt).Select(p => MapToResponse(p)).ToListAsync();
    }

    public async Task<PropertyResponse> GetByIdAsync(Guid id)
    {
        var property = await db.Properties.Include(p => p.Host).FirstOrDefaultAsync(p => p.Id == id)
            ?? throw new KeyNotFoundException("Property not found.");
        return MapToResponse(property);
    }

    public async Task<IEnumerable<PropertyResponse>> GetByHostAsync(Guid hostId)
    {
        return await db.Properties.Include(p => p.Host)
            .Where(p => p.HostId == hostId)
            .OrderByDescending(p => p.CreatedAt)
            .Select(p => MapToResponse(p))
            .ToListAsync();
    }

    public async Task<PropertyResponse> CreateAsync(CreatePropertyRequest req, Guid hostId)
    {
        var property = new Property
        {
            HostId = hostId,
            Title = req.Title,
            Description = req.Description,
            Address = req.Address,
            City = req.City,
            Country = req.Country,
            PricePerNight = req.PricePerNight,
            MaxGuests = req.MaxGuests,
            Bedrooms = req.Bedrooms,
            Bathrooms = req.Bathrooms,
            ImageUrl = req.ImageUrl
        };

        db.Properties.Add(property);
        await db.SaveChangesAsync();
        await db.Entry(property).Reference(p => p.Host).LoadAsync();
        return MapToResponse(property);
    }

    public async Task<PropertyResponse> UpdateAsync(Guid id, UpdatePropertyRequest req, Guid hostId)
    {
        var property = await db.Properties.Include(p => p.Host).FirstOrDefaultAsync(p => p.Id == id)
            ?? throw new KeyNotFoundException("Property not found.");

        if (property.HostId != hostId)
            throw new UnauthorizedAccessException("Not your property.");

        if (req.Title != null) property.Title = req.Title;
        if (req.Description != null) property.Description = req.Description;
        if (req.Address != null) property.Address = req.Address;
        if (req.City != null) property.City = req.City;
        if (req.Country != null) property.Country = req.Country;
        if (req.PricePerNight.HasValue) property.PricePerNight = req.PricePerNight.Value;
        if (req.MaxGuests.HasValue) property.MaxGuests = req.MaxGuests.Value;
        if (req.Bedrooms.HasValue) property.Bedrooms = req.Bedrooms.Value;
        if (req.Bathrooms.HasValue) property.Bathrooms = req.Bathrooms.Value;
        if (req.ImageUrl != null) property.ImageUrl = req.ImageUrl;
        if (req.IsActive.HasValue) property.IsActive = req.IsActive.Value;

        await db.SaveChangesAsync();
        return MapToResponse(property);
    }

    public async Task DeleteAsync(Guid id, Guid hostId)
    {
        var property = await db.Properties.FindAsync(id)
            ?? throw new KeyNotFoundException("Property not found.");

        if (property.HostId != hostId)
            throw new UnauthorizedAccessException("Not your property.");

        db.Properties.Remove(property);
        await db.SaveChangesAsync();
    }

    private static PropertyResponse MapToResponse(Property p) => new(
        p.Id, p.Title, p.Description, p.Address, p.City, p.Country,
        p.PricePerNight, p.MaxGuests, p.Bedrooms, p.Bathrooms, p.ImageUrl,
        $"{p.Host.FirstName} {p.Host.LastName}", p.HostId, p.CreatedAt
    );
}
