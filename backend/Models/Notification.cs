namespace ContactApi.Models
{
    public class Notification
    {
        public int Id { get; set; }

        public int? UserId { get; set; }

        public string? Role { get; set; }

        public string? Message { get; set; }

        public string? Type { get; set; }

        public bool IsRead { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public int? RelatedId { get; set; }
        public string? TargetUrl { get; set; }
        public string? UserEmail { get; set; }
    }
}