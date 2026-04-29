using System.Security.Claims;
using CoolStay.Api.DTOs.Booking;
using CoolStay.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CoolStay.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class BookingsController(BookingService bookingService) : ControllerBase
{
    private Guid UserId => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
    private string UserRole => User.FindFirstValue(ClaimTypes.Role)!;

    [HttpGet]
    public async Task<IActionResult> GetMyBookings()
    {
        if (UserRole == "host")
            return Ok(await bookingService.GetHostBookingsAsync(UserId));

        return Ok(await bookingService.GetUserBookingsAsync(UserId));
    }

    [HttpPost]
    [Authorize(Roles = "guest")]
    public async Task<IActionResult> Create(CreateBookingRequest req)
    {
        var result = await bookingService.CreateAsync(req, UserId);
        return CreatedAtAction(nameof(GetMyBookings), result);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Cancel(Guid id)
    {
        await bookingService.CancelAsync(id, UserId);
        return NoContent();
    }
}
