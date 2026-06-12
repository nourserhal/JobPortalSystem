namespace ContactApi.Models
{
    public class SavedJob
    {
        public int Id { get; set; }

        public int JobId { get; set; }

        public int JobseekerId { get; set; }

        public DateTime SavedDate { get; set; } = DateTime.Now;

        public Job? Job { get; set; }
    }
}