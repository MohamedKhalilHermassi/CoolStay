namespace CoolStay.Api.DTOs.Property;

public record PropertyResponse(
    Guid Id,
    string Title,
    string Description,
    string Address,
    string City,
    string Country,
    decimal PricePerNight,
    int MaxGuests,
    int Bedrooms,
    int Bathrooms,
    string ImageUrl,
    string HostName,
    Guid HostId,
    DateTime CreatedAt
);
