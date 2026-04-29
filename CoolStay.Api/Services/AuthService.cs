using CoolStay.Api.Data;
using CoolStay.Api.DTOs.Auth;
using CoolStay.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace CoolStay.Api.Services;

public class AuthService(AppDbContext db, TokenService tokenService)
{
    public async Task<AuthResponse> RegisterAsync(RegisterRequest req)
    {
        if (await db.Users.AnyAsync(u => u.Email == req.Email))
            throw new InvalidOperationException("Email already in use.");

        var role = req.Role == "host" ? "host" : "guest";
        var user = new User
        {
            Email = req.Email.ToLower(),
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(req.Password),
            FirstName = req.FirstName,
            LastName = req.LastName,
            Role = role
        };

        db.Users.Add(user);
        await db.SaveChangesAsync();

        return new AuthResponse(tokenService.Generate(user), user.Id.ToString(), user.Email, user.FirstName, user.LastName, user.Role);
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest req)
    {
        var user = await db.Users.FirstOrDefaultAsync(u => u.Email == req.Email.ToLower())
            ?? throw new UnauthorizedAccessException("Invalid credentials.");

        if (!BCrypt.Net.BCrypt.Verify(req.Password, user.PasswordHash))
            throw new UnauthorizedAccessException("Invalid credentials.");

        return new AuthResponse(tokenService.Generate(user), user.Id.ToString(), user.Email, user.FirstName, user.LastName, user.Role);
    }
}
