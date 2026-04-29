using System.ComponentModel.DataAnnotations;

namespace CoolStay.Api.DTOs.Auth;

public record LoginRequest(
    [Required, EmailAddress] string Email,
    [Required] string Password
);
