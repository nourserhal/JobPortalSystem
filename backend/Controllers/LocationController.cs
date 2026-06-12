using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace ContactApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LocationController : ControllerBase
    {
        [HttpGet("search")]
        public async Task<IActionResult> SearchLocations([FromQuery] string query)
        {
            if (string.IsNullOrWhiteSpace(query) || query.Length < 2)
            {
                return Ok(new List<string>());
            }

            using var client = new HttpClient();

            client.DefaultRequestHeaders.UserAgent.ParseAdd(
                "JobPortalStudentProject/1.0"
            );

            var url =
                $"https://nominatim.openstreetmap.org/search?format=json&q={Uri.EscapeDataString(query)}&addressdetails=1&limit=5";

            var response = await client.GetAsync(url);

            if (!response.IsSuccessStatusCode)
            {
                return Ok(new List<string>());
            }

            var json = await response.Content.ReadAsStringAsync();

            var data = JsonSerializer.Deserialize<List<NominatimResult>>(
                json,
                new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                }
            );

            var locations = data?
                .Select(item => item.Display_Name)
                .Where(name => !string.IsNullOrWhiteSpace(name))
                .ToList();

            return Ok(locations);
        }
    }

    public class NominatimResult
    {
        public string? Display_Name { get; set; }
    }
}