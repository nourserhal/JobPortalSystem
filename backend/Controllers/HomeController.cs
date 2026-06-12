using ContactApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ContactApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HomeController : ControllerBase
    {
        private readonly AppDbContext _context;

        public HomeController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/home/stats
        [HttpGet("stats")]
        public async Task<IActionResult> GetHomeStats()
        {
            var totalUsers = await _context.Users
                .Where(u => u.Role == "jobseeker")
                .CountAsync();

            var totalEmployers = await _context.Users
                .Where(u => u.Role == "employer")
                .CountAsync();

            var totalJobs = await _context.Jobs
                .Where(j => j.Status == "Active")
                .CountAsync();

            return Ok(new
            {
                totalUsers,
                totalEmployers,
                totalJobs
            });
        }
    }
}