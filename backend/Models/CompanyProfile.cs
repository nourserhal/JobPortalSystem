namespace ContactApi.Models
{
    public class CompanyProfile
    {
        public int Id { get; set; }

        public string? FullName { get; set; }
        public string? Email { get; set; }

        public string? CompanyName { get; set; }
        public string? CompanyDescription { get; set; }

        public string? Role { get; set; } = "Employer";
    }
}