using ContactApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ContactApi.Controllers
{
    public class JobStatusUpdateDto
    {
        public string Status { get; set; } = "";
        public string? RejectionReason { get; set; }
    }

    [ApiController]
    [Route("api/[controller]")]
    public class JobsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public JobsController(AppDbContext context)
        {
            _context = context;
        }
        private int CalculateRecommendationScore(Job job, User jobseeker)
        {
            int score = 0;

            var seekerSkills = (jobseeker.Skills ?? "")
                .ToLower()
                .Split(',')
                .Select(s => s.Trim())
                .Where(s => s != "")
                .ToList();

            var jobSkills = (job.Skills ?? "")
                .ToLower()
                .Split(',')
                .Select(s => s.Trim())
                .Where(s => s != "")
                .ToList();

            foreach (var skill in jobSkills)
            {
                if (seekerSkills.Contains(skill))
                {
                    score += 20;
                }
            }

            if (
                !string.IsNullOrEmpty(job.Location) &&
                !string.IsNullOrEmpty(jobseeker.Location) &&
                job.Location.ToLower().Contains(jobseeker.Location.ToLower())
            )
            {
                score += 10;
            }

            if (
                !string.IsNullOrEmpty(jobseeker.Experience) &&
                !string.IsNullOrEmpty(job.Requirements) &&
                job.Requirements.ToLower().Contains(jobseeker.Experience.ToLower())
            )
            {
                score += 10;
            }

            return Math.Min(score, 100);
        }

        // GET: api/jobs
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Job>>> GetJobs()
        {
            var jobs = await _context.Jobs
                .Select(job => new
                {
                    job.Id,
                    job.EmployerId,
                    job.Title,
                    job.Company,
                    job.Location,
                    job.Type,
                    job.Skills,
                    job.Description,
                    job.Status,
                    job.Category,
                    job.Requirements,
                    job.SalaryMin,
                    job.SalaryMax,
                    job.CreatedAt,
                    job.RejectionReason,
                    job.RequestedCategory,
                    ApplicantsCount = _context.Applications.Count(a => a.JobId == job.Id)
                })
                .ToListAsync();

            return Ok(jobs);
        }

        // POST: api/jobs
        [HttpPost]
        public async Task<ActionResult<Job>> PostJob(Job job)
        {
            job.Status = "Pending";
            job.RejectionReason = null;
            job.CreatedAt = DateTime.Now;

            _context.Jobs.Add(job);
            await _context.SaveChangesAsync();

            var notification = new Notification
            {  
                Role = "admin",
                Type = "Pending Job",
                Message = $"New job pending review: {job.Title}",
                RelatedId = job.Id,
                TargetUrl = $"/admin/jobs/{job.Id}",
                IsRead = false,
                CreatedAt = DateTime.Now
            };

            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();

            return Ok(job);
        }

        // GET: api/jobs/employer/5
        [HttpGet("employer/{employerId}")]
        public async Task<ActionResult<IEnumerable<Job>>> GetJobsByEmployer(int employerId)
        {
            return await _context.Jobs
                .Where(j => j.EmployerId == employerId)
                .ToListAsync();
        }
        [HttpGet("recommended/{userId}")]
        public async Task<ActionResult<IEnumerable<object>>> GetRecommendedJobs(int userId)
        {
            var user = await _context.Users.FindAsync(userId);

            if (user == null)
            {
                return NotFound("User not found");
            }

            var jobs = await _context.Jobs
                .Where(j => j.Status == "Active")
                .ToListAsync();

            var recommendedJobs = jobs
                .Select(job => new
                {
                    Job = job,
                    MatchScore = CalculateRecommendationScore(job, user)
                })
                .Where(x => x.MatchScore > 0)
                .OrderByDescending(x => x.MatchScore)
                .Take(10)
                .ToList();
            return Ok(recommendedJobs);
        }

        // PUT: api/jobs/5/status
        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateJobStatus(
            int id,
            [FromBody] JobStatusUpdateDto request
        )
        {
            var job = await _context.Jobs.FindAsync(id);

            if (job == null)
            {
                return NotFound("Job not found");
            }

            job.Status = request.Status;

            if (request.Status == "Rejected")
            {
                job.RejectionReason = request.RejectionReason;
            }
            else
            {
                job.RejectionReason = null;
            }

            await _context.SaveChangesAsync();
            if (request.Status == "Active")
            {
                var notification = new Notification
                {
                    UserId = job.EmployerId,
                    Role = "employer",
                    Type = "Job Approved",
                    Message = $"Your job '{job.Title}' has been approved.",
                    RelatedId = job.Id,
                    TargetUrl = $"/employer/job/{job.Id}",
                    IsRead = false,
                    CreatedAt = DateTime.Now
                };

                _context.Notifications.Add(notification);
                var jobseekers = await _context.Users
                    .Where(u => u.Role == "jobseeker")
                    .ToListAsync();

                foreach (var jobseeker in jobseekers)
                {
                    int matchScore = 0;

                    var jobText =
                        $"{job.Title} {job.Category} {job.Skills} {job.Description} {job.Requirements}"
                        .ToLower();

                    var seekerText =
                        $"{jobseeker.Skills} {jobseeker.Experience}"
                        .ToLower();

                    var jobWords = jobText
                        .Split(new[] { ',', ' ', '.', ';', '-' },
                            StringSplitOptions.RemoveEmptyEntries)
                        .Distinct()
                        .ToList();

                    foreach (var word in jobWords)
                    {
                        if (word.Length > 2 && seekerText.Contains(word))
                        {
                            matchScore++;
                        }
                    }

                    var previousApplications = await _context.Applications
                        .Where(a => a.ApplicantEmail == jobseeker.Email)
                        .Include(a => a.Job)
                        .ToListAsync();

                    foreach (var app in previousApplications)
                    {
                        if (
                            app.Job != null &&
                            app.Job.Category == job.Category
                        )
                        {
                            matchScore += 2;
                        }
                    }

                    if (matchScore >= 2)
                    {
                        var recommendationNotification =
                            new Notification
                            {
                                UserId = jobseeker.Id,
                                UserEmail = jobseeker.Email,
                                Role = "jobseeker",
                                Type = "Recommended Job",
                                Message =
                                    $"New job matching your profile: {job.Title}",
                                RelatedId = job.Id,
                                TargetUrl = $"/job/{job.Id}",
                                IsRead = false,
                                CreatedAt = DateTime.Now
                            };

                        _context.Notifications.Add(
                            recommendationNotification
                        );
                    }
                }
            }

            if (request.Status == "Rejected")
            {
                var notification = new Notification
                {
                    UserId = job.EmployerId,
                    Role = "employer",
                    Type = "Job Rejected",
                    Message = $"Your job '{job.Title}' was rejected. Reason: {request.RejectionReason}",
                    RelatedId = job.Id,
                    TargetUrl = $"/employer/job/{job.Id}",
                    IsRead = false,
                    CreatedAt = DateTime.Now
                };

                _context.Notifications.Add(notification);
            }
            if (request.Status == "Pending")
            {
                var notification = new Notification
                {
                    Role = "admin",
                    Type = "Pending Job",
                    Message = $"New job pending review: {job.Title}",
                    RelatedId = job.Id,
                    TargetUrl = $"/admin/jobs/{job.Id}",
                    IsRead = false,
                    CreatedAt = DateTime.Now
                };

                _context.Notifications.Add(notification);
            }
            await _context.SaveChangesAsync();
            return Ok(job);
        }

        // PUT: api/jobs/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateJob(int id, Job updatedJob)
        {
            var job = await _context.Jobs.FindAsync(id);

            if (job == null)
            {
                return NotFound("Job not found");
            }

            job.Title = updatedJob.Title;
            job.Company = updatedJob.Company;
            job.Location = updatedJob.Location;
            job.Type = updatedJob.Type;
            job.Category = updatedJob.Category;
            job.Skills = updatedJob.Skills;
            job.Description = updatedJob.Description;
            job.Requirements = updatedJob.Requirements;
            job.SalaryMin = updatedJob.SalaryMin;
            job.SalaryMax = updatedJob.SalaryMax;
            job.RequestedCategory = updatedJob.RequestedCategory;

            // If employer edits a rejected job, send it back for admin review
            if (job.Status == "Rejected")
            {
                job.Status = "Pending";
                job.RejectionReason = null;
            }

            await _context.SaveChangesAsync();

            return Ok(job);
        }

        // DELETE: api/jobs/5
        
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteJob(int id)
        {
            var job = await _context.Jobs
                .Include(j => j.Applications)
                .FirstOrDefaultAsync(j => j.Id == id);

            if (job == null)
            {
                return NotFound("Job not found");
            }

            if (job.Applications != null && job.Applications.Any())
            {
                return BadRequest("This job has applications. Close it instead of deleting it.");
            }

            _context.Jobs.Remove(job);

            await _context.SaveChangesAsync();

            return Ok("Job deleted successfully");
        }
    }
}