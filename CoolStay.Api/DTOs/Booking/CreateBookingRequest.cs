using System.ComponentModel.DataAnnotations;

namespace CoolStay.Api.DTOs.Booking;

public record CreateBookingRequest(
    [Required] Guid PropertyId,
    [Required] DateTime CheckIn,
    [Required] DateTime CheckOut
);
