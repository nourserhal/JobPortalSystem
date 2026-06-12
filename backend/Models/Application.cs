namespace ContactApi.Models
{
    public class Application
    {
        public int Id { get; set; }

        // Applicant info
        public string? ApplicantName { get; set; }
        public string? ApplicantEmail { get; set; }
        public string? ResumeUrl { get; set; }

        // Status
        public string? Status { get; set; } = "Applied";

        // Date
        public DateTime? AppliedDate { get; set; } = DateTime.Now;

        // Foreign Key
        public int? JobId { get; set; }

        // Navigation
        public Job? Job { get; set; }
        public string? CoverLetter { get; set; }
       
    }
}