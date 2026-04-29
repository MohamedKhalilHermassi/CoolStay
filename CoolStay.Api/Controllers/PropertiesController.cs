using System.Security.Claims;
using CoolStay.Api.DTOs.Property;
using CoolStay.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CoolStay.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PropertiesController(PropertyService propertyService) : ControllerBase
{
    private Guid UserId => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet]
    public async Task<IActionResult> Search([FromQuery] string? city, [FromQuery] int? guests)
        => Ok(await propertyService.SearchAsync(city, guests));

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
        => Ok(await propertyService.GetByIdAsync(id));

    [HttpGet("my")]
    [Authorize(Roles = "host")]
    public async Task<IActionResult> GetMyListings()
        => Ok(await propertyService.GetByHostAsync(UserId));

    [HttpPost]
    [Authorize(Roles = "host")]
    public async Task<IActionResult> Create(CreatePropertyRequest req)
    {
        var result = await propertyService.CreateAsync(req, UserId);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = "host")]
    public async Task<IActionResult> Update(Guid id, UpdatePropertyRequest req)
        => Ok(await propertyService.UpdateAsync(id, req, UserId));

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "host")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await propertyService.DeleteAsync(id, UserId);
        return NoContent();
    }
}
