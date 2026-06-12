using Microsoft.AspNetCore.Mvc; 
using ContactApi.Models; 
namespace ContactApi.Controllers 
{ [ApiController] 
[Route("api/[controller]")] 
public class ContactController : ControllerBase { 
    private static List<ContactMessage> messages = new();

    [HttpGet]
    public IActionResult Get()
    {
        return Ok(messages);
    }

    [HttpPost]
    public IActionResult Post([FromBody] ContactMessage msg)
    {
        messages.Add(msg);
        return Ok(msg);
    }
}
}