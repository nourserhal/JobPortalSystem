using ContactApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ContactApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UserController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/User
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            return await _context.Users.ToListAsync();
        }

        // GET: api/User/role/employer
        [HttpGet("role/{role}")]
        public async Task<ActionResult<IEnumerable<User>>> GetUsersByRole(string role)
        {
            return await _context.Users
                .Where(u => u.Role == role)
                .ToListAsync();
        }


        // PUT: api/User/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, User updatedUser)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound("User not found");
            }

            user.Email = updatedUser.Email;
            user.FullName = updatedUser.FullName;
            user.Skills = updatedUser.Skills;
            user.Experience = updatedUser.Experience;
            user.Location = updatedUser.Location;
            user.CvName = updatedUser.CvName;

            user.HrName = updatedUser.HrName;
            user.CompanyName = updatedUser.CompanyName;
            user.CompanyWebsite = updatedUser.CompanyWebsite;
            user.Industry = updatedUser.Industry;
            user.CompanyLocation = updatedUser.CompanyLocation;
            user.CompanyDescription = updatedUser.CompanyDescription;

            user.IsBlocked = updatedUser.IsBlocked;
            user.BlockReason = updatedUser.BlockReason;

            await _context.SaveChangesAsync();

            return Ok(user);
        }


        // DELETE: api/User/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound("User not found");
            }

            // Delete all applications related to this user/applicant
            var userApplications = await _context.Applications
                .Where(a => a.ApplicantEmail == user.Email)
                .ToListAsync();

            _context.Applications.RemoveRange(userApplications);

            // Then delete the user
            _context.Users.Remove(user);

            await _context.SaveChangesAsync();

            return Ok("User and related applications deleted successfully");
        }
    }
}