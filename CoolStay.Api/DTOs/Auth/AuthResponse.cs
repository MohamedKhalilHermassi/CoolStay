namespace CoolStay.Api.DTOs.Auth;

public record AuthResponse(
    string Token,
    string UserId,
    string Email,
    string FirstName,
    string LastName,
    string Role
);
