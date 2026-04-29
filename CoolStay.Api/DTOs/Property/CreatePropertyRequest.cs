using System.ComponentModel.DataAnnotations;

namespace CoolStay.Api.DTOs.Property;

public record CreatePropertyRequest(
    [Required] string Title,
    [Required] string Description,
    [Required] string Address,
    [Required] string City,
    [Required] string Country,
    [Range(1, 100000)] decimal PricePerNight,
    [Range(1, 50)] int MaxGuests,
    [Range(1, 50)] int Bedrooms,
    [Range(1, 50)] int Bathrooms,
    string ImageUrl = ""
);
