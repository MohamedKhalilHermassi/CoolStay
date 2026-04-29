using CoolStay.Api.DTOs.Auth;
using CoolStay.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace CoolStay.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(AuthService authService) : ControllerBase
{
    [HttpPost("register")]
    public async Task<ActionResult<AuthResponse>> Register(RegisterRequest req)
        => Ok(await authService.RegisterAsync(req));

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login(LoginRequest req)
        => Ok(await authService.LoginAsync(req));
}
