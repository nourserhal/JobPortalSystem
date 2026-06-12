using ContactApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ContactApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class JobTypesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public JobTypesController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<JobType>>> GetJobTypes()
        {
            return await _context.JobTypes.ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<JobType>> AddJobType(JobType jobType)
        {
            _context.JobTypes.Add(jobType);
            await _context.SaveChangesAsync();

            return Ok(jobType);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateJobType(int id, JobType updatedJobType)
        {
            var jobType = await _context.JobTypes.FindAsync(id);

            if (jobType == null)
            {
                return NotFound("Job type not found");
            }

            jobType.Name = updatedJobType.Name;

            await _context.SaveChangesAsync();

            return Ok(jobType);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteJobType(int id)
        {
            var jobType = await _context.JobTypes.FindAsync(id);

            if (jobType == null)
            {
                return NotFound("Job type not found");
            }

            _context.JobTypes.Remove(jobType);
            await _context.SaveChangesAsync();

            return Ok("Job type deleted");
        }
    }
}