using Microsoft.AspNetCore.Mvc;
using TutorFinder.Infrastructure.Data;

namespace TutorFinder.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class SystemController : ControllerBase
{
    private readonly DbSeeder _seeder;

    public SystemController(DbSeeder seeder)
    {
        _seeder = seeder;
    }

    [HttpPost("seed")]
    public async Task<IActionResult> Seed()
    {
        try
        {
            await _seeder.SeedAsync();
            return Ok(new { message = "Database seeded successfully" });
        }
        catch (Exception ex)
        {
            return Problem(ex.Message);
        }
    }
}
