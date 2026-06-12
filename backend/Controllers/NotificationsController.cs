using ContactApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ContactApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NotificationsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public NotificationsController(AppDbContext context)
        {
            _context = context;
        }

        // GET all notifications
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Notification>>> GetNotifications()
        {
            return await _context.Notifications
                .OrderByDescending(n => n.CreatedAt)
                .ToListAsync();
        }

        // GET notifications by email
        [HttpGet("email/{email}")]
        public async Task<ActionResult<IEnumerable<Notification>>> GetByEmail(string email)
        {
            return await _context.Notifications
                .Where(n => n.UserEmail == email)
                .OrderByDescending(n => n.CreatedAt)
                .ToListAsync();
        }

        // GET notifications by user id
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<Notification>>> GetByUser(int userId)
        {
            return await _context.Notifications
                .Where(n => n.UserId == userId)
                .OrderByDescending(n => n.CreatedAt)
                .ToListAsync();
        }

        // GET notifications by role
        [HttpGet("role/{role}")]
        public async Task<ActionResult<IEnumerable<Notification>>> GetByRole(string role)
        {
            return await _context.Notifications
                .Where(n => n.Role == role)
                .OrderByDescending(n => n.CreatedAt)
                .ToListAsync();
        }

        // CREATE notification
        [HttpPost]
        public async Task<ActionResult<Notification>> CreateNotification(Notification notification)
        {
            notification.IsRead = false;
            notification.CreatedAt = DateTime.Now;

            _context.Notifications.Add(notification);

            await _context.SaveChangesAsync();

            return Ok(notification);
        }

        // MARK notification as read
        [HttpPut("{id}/read")]
        public async Task<IActionResult> MarkAsRead(int id)
        {
            var notification = await _context.Notifications.FindAsync(id);

            if (notification == null)
            {
                return NotFound("Notification not found");
            }

            notification.IsRead = true;

            await _context.SaveChangesAsync();

            return Ok(notification);
        }

        // MARK all user notifications as read
        [HttpPut("user/{userId}/read-all")]
        public async Task<IActionResult> MarkAllUserAsRead(int userId)
        {
            var notifications = await _context.Notifications
                .Where(n => n.UserId == userId)
                .ToListAsync();

            foreach (var notification in notifications)
            {
                notification.IsRead = true;
            }

            await _context.SaveChangesAsync();

            return Ok("All notifications marked as read");
        }

        // MARK all role notifications as read
        [HttpPut("role/{role}/read-all")]
        public async Task<IActionResult> MarkAllRoleAsRead(string role)
        {
            var notifications = await _context.Notifications
                .Where(n => n.Role == role)
                .ToListAsync();

            foreach (var notification in notifications)
            {
                notification.IsRead = true;
            }

            await _context.SaveChangesAsync();

            return Ok("All notifications marked as read");
        }
    }
}