namespace CoolStay.Api.DTOs.Booking;

public record BookingResponse(
    Guid Id,
    Guid PropertyId,
    string PropertyTitle,
    string PropertyCity,
    string PropertyImageUrl,
    Guid GuestId,
    string GuestName,
    DateTime CheckIn,
    DateTime CheckOut,
    decimal TotalPrice,
    string Status,
    DateTime CreatedAt
);
