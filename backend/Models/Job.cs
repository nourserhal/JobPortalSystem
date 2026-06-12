namespace ContactApi.Models
{
    public class Job
    {
        public int Id { get; set; }
        public int? EmployerId { get; set; }

        public string? Title { get; set; }

        public string? Company { get; set; }

        public string? Location { get; set; }

        public string? Type { get; set; }

        public string? Skills { get; set; }

        public string? Description { get; set; }

        public string? Status { get; set; }
        public string? Category { get; set; }
        public string? Requirements { get; set; }
        public decimal? SalaryMin { get; set; }
        public decimal? SalaryMax { get; set; }
        public List<Application>? Applications { get; set; }
        public string? RejectionReason { get; set; }
        public string? RequestedCategory { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}