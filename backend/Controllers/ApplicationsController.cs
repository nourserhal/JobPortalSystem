using ContactApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ContactApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ApplicationsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ApplicationsController(AppDbContext context)
        {
            _context = context;
        }

        // GET applications by job
        [HttpGet("job/{jobId}")]
        public async Task<ActionResult<IEnumerable<Application>>> GetApplicationsByJob(int jobId)
        {
            return await _context.Applications
                .Include(a => a.Job)
                .Where(a => a.JobId == jobId)
                .ToListAsync();
        }

        // POST apply to job
        [HttpPost]
        public async Task<ActionResult<Application>> Apply(Application application)
        {
            var existingApplication = await _context.Applications
                .FirstOrDefaultAsync(a =>
                    a.JobId == application.JobId &&
                    a.ApplicantEmail == application.ApplicantEmail
                );

            if (existingApplication != null)
            {
                return BadRequest("You already applied to this job.");
            }
            _context.Applications.Add(application);

            await _context.SaveChangesAsync();

            var job = await _context.Jobs.FindAsync(application.JobId);

            if (job != null)
            {
                // Employer notification
                var employerNotification = new Notification
                {
                    UserId = job.EmployerId,
                    Role = "employer",
                    Type = "New Applicant",
                    Message = $"{application.ApplicantName} applied to your job '{job.Title}'.",
                    RelatedId = application.Id,
                    TargetUrl = $"/employer/jobs/{job.Id}/applicants",
                    IsRead = false,
                    CreatedAt = DateTime.Now,
                    UserEmail = null
                };

                _context.Notifications.Add(employerNotification);

                // Jobseeker notification
                var jobseekerNotification = new Notification
                {
                    UserId = null,
                    UserEmail = application.ApplicantEmail,
                    Role = "jobseeker",
                    Type = "Application Submitted",
                    Message = $"You successfully applied to '{job.Title}'.",
                    RelatedId = application.Id,
                    TargetUrl = "/jobseeker/applications",
                    IsRead = false,
                    CreatedAt = DateTime.Now
                };

                _context.Notifications.Add(jobseekerNotification);

                await _context.SaveChangesAsync();
            }

            return Ok(application);
        }

        // UPDATE application status
        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateStatus(
            int id,
            [FromBody] string status
        )
        {
            var application = await _context.Applications.FindAsync(id);

            if (application == null)
            {
                return NotFound();
            }

            application.Status = status;

            await _context.SaveChangesAsync();

            var notification = new Notification
            {
                UserId = null,
                UserEmail = application.ApplicantEmail,
                Role = "jobseeker",
                Type = $"Application {status}",
                Message = $"Your application status is now {status}.",
                RelatedId = application.Id,
                TargetUrl = "/jobseeker/applications",
                IsRead = false,
                CreatedAt = DateTime.Now
            };

            _context.Notifications.Add(notification);

            await _context.SaveChangesAsync();

            return Ok(application);
        }

        // DELETE application
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteApplication(int id)
        {
            var application = await _context.Applications.FindAsync(id);

            if (application == null)
            {
                return NotFound();
            }

            _context.Applications.Remove(application);

            await _context.SaveChangesAsync();

            return Ok();
        }

        // GET: api/Applications
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Application>>> GetAllApplications()
        {
            return await _context.Applications
                .Include(a => a.Job)
                .ToListAsync();
        }
    }
}