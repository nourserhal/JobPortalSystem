namespace ContactApi.Models
{
    public class User
    {
        public int Id { get; set; }

        public string? Role { get; set; }
        public bool IsEmailVerified { get; set; } = false;
        public string? VerificationCode { get; set; }

        // common
        public string? Email { get; set; }
        public string? Password { get; set; }
        public bool IsBlocked { get; set; } = false;
        public string? BlockReason { get; set; }

        // jobseeker
        public string? FullName { get; set; }
        public string? Skills { get; set; }
        public string? Experience { get; set; }
        public string? Location { get; set; }
        public string? CvName { get; set; }

        // employer
        public string? CompanyName { get; set; }
        public string? HrName { get; set; }
        public string? CompanyWebsite { get; set; }
        public string? Industry { get; set; }
        public string? CompanyLocation { get; set; }
        public string? CompanyDescription { get; set; }
    }
}