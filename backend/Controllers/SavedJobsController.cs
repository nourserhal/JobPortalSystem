using ContactApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ContactApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SavedJobsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SavedJobsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/SavedJobs/user/5
        [HttpGet("user/{jobseekerId}")]
        public async Task<ActionResult<IEnumerable<SavedJob>>> GetSavedJobsByUser(int jobseekerId)
        {
            return await _context.SavedJobs
                .Where(s => s.JobseekerId == jobseekerId)
                .ToListAsync();
        }

        // POST: api/SavedJobs
        [HttpPost]
        public async Task<ActionResult<SavedJob>> SaveJob(SavedJob savedJob)
        {
            var alreadySaved = await _context.SavedJobs.FirstOrDefaultAsync(s =>
                s.JobId == savedJob.JobId &&
                s.JobseekerId == savedJob.JobseekerId
            );

            if (alreadySaved != null)
            {
                return BadRequest("Job already saved");
            }

            _context.SavedJobs.Add(savedJob);
            await _context.SaveChangesAsync();

            return Ok(savedJob);
        }

        // DELETE: api/SavedJobs/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSavedJob(int id)
        {
            var savedJob = await _context.SavedJobs.FindAsync(id);

            if (savedJob == null)
            {
                return NotFound("Saved job not found");
            }

            _context.SavedJobs.Remove(savedJob);
            await _context.SaveChangesAsync();

            return Ok("Saved job removed");
        }
    }
}