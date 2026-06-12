using Microsoft.AspNetCore.Mvc;

namespace ContactApi.Controllers
{
    public class SkillSuggestionRequest
    {
        public string? Text { get; set; }
        public string? Title { get; set; }
        public string? Category { get; set; }
        public string? Description { get; set; }
        public string? Requirements { get; set; }
    }

    [ApiController]
    [Route("api/[controller]")]
    public class AiController : ControllerBase
    {
        [HttpPost("skills")]
        public IActionResult SuggestSkills(SkillSuggestionRequest request)
        {
            var text = $"{request.Text} {request.Title} {request.Category} {request.Description} {request.Requirements}"
                .ToLower();

            var skills = new List<string>();

            var skillBank = new List<string>
            {
                "Accounting", "Adobe Photoshop", "Adobe Illustrator", "Agile", "Android Studio", "Angular",
                "Bootstrap", "Branding", "Business Analysis",
                "C#", "C++", "CSS", "Communication", "Customer Service", "Cybersecurity",
                "Data Analysis", "Data Entry", "Database Management", "Digital Marketing", "Docker",
                "Excel", "Express.js", "Entity Framework",
                "Figma", "Firebase", "Flutter", "French",
                "Git", "GitHub", "Graphic Design",
                "HTML", "Human Resources",
                "Illustration", "Instagram Marketing",
                "Java", "JavaScript", "Jira",
                "Kotlin",
                "Laravel", "Linux",
                "Machine Learning", "Management", "Marketing", "Microsoft Excel", "Microsoft Office",
                "Microsoft PowerPoint", "Microsoft Word", "MongoDB", "MySQL",
                "Network Security", "Node.js",
                "Office Administration",
                "PHP", "Python", "Power BI", "Problem Solving", "Project Management",
                "Quality Assurance",
                "React", "React Native", "REST API",
                "Sales", "SEO", "SQL", "Social Media Marketing",
                "Tailwind CSS", "Teamwork", "TypeScript", "Time Management",
                "UI/UX", "Unity",
                "Video Editing", "Vue.js",
                "Web Design", "WordPress",
                "XML",
                "YouTube Marketing",
                "Zoom Communication"
            };

            if (!string.IsNullOrWhiteSpace(request.Text))
            {
                var typed = request.Text.Split(",").Last().Trim().ToLower();

                var startsWith = skillBank
                    .Where(skill => skill.ToLower().StartsWith(typed))
                    .ToList();

                var contains = skillBank
                    .Where(skill =>
                        skill.ToLower().Contains(typed) &&
                        !skill.ToLower().StartsWith(typed))
                    .ToList();

                skills.AddRange(startsWith);
                skills.AddRange(contains);
            }

            if (text.Contains("frontend") || text.Contains("react") || text.Contains("web"))
            {
                skills.AddRange(new[] { "React", "JavaScript", "HTML", "CSS", "Git", "Tailwind CSS" });
            }

            if (text.Contains("backend") || text.Contains("api") || text.Contains("server"))
            {
                skills.AddRange(new[] { "C#", "ASP.NET Core", "SQL", "REST API", "Entity Framework" });
            }

            if (text.Contains("mobile") || text.Contains("android"))
            {
                skills.AddRange(new[] { "Java", "Kotlin", "Android Studio", "Flutter", "React Native" });
            }

            if (text.Contains("data") || text.Contains("analytics"))
            {
                skills.AddRange(new[] { "Python", "SQL", "Excel", "Power BI", "Data Analysis" });
            }

            if (text.Contains("design") || text.Contains("ui") || text.Contains("ux"))
            {
                skills.AddRange(new[] { "Figma", "UI/UX", "Web Design", "Adobe XD", "Graphic Design" });
            }

            if (text.Contains("security") || text.Contains("cyber"))
            {
                skills.AddRange(new[] { "Linux", "Network Security", "Cybersecurity", "Firewalls" });
            }

            if (!skills.Any())
            {
                skills.AddRange(new[] { "Communication", "Problem Solving", "Teamwork", "Time Management" });
            }

            return Ok(new
            {
                skills = skills.Distinct().Take(10).ToList()
            });
        }
    }
}