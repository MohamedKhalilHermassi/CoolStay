namespace CoolStay.Api.DTOs.Property;

public record UpdatePropertyRequest(
    string? Title,
    string? Description,
    string? Address,
    string? City,
    string? Country,
    decimal? PricePerNight,
    int? MaxGuests,
    int? Bedrooms,
    int? Bathrooms,
    string? ImageUrl,
    bool? IsActive
);
