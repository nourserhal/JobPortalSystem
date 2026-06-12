using Microsoft.AspNetCore.Mvc;
using ContactApi.Models;
using Microsoft.EntityFrameworkCore;
using ContactApi.Services;

namespace ContactApi.Controllers
{
    public class ForgotPasswordDto
    {
        public string Email { get; set; } = "";
    }

    public class ResetPasswordDto
    {
        public string Email { get; set; } = "";
        public string Code { get; set; } = "";
        public string NewPassword { get; set; } = "";
    }

    [ApiController]
    [Route("api/[controller]")]
    public class LoginController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly EmailService _emailService;

        public LoginController(
            AppDbContext context,
            EmailService emailService
        )
        {
            _context = context;
            _emailService = emailService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] User loginUser)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u =>
                u.Email == loginUser.Email &&
                u.Password == loginUser.Password &&
                u.Role == loginUser.Role
            );

            if (user == null)
            {
                return Unauthorized("Invalid email or password");
            }

            if (user.IsBlocked)
            {
                return Unauthorized(
                    $"Your account is blocked. Reason: {user.BlockReason}"
                );
            }

            if (!user.IsEmailVerified && user.Role != "admin")
            {
                return Unauthorized("Please verify your email first");
            }

            return Ok(user);
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword(
            [FromBody] ForgotPasswordDto request
        )
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == request.Email);

            if (user == null)
            {
                return BadRequest("Email not found");
            }

            var resetCode = new Random()
                .Next(100000, 999999)
                .ToString();

            user.VerificationCode = resetCode;

            await _context.SaveChangesAsync();

            await _emailService.SendEmailAsync(
                user.Email,
                "Reset Your Password",
                $"Your password reset code is: {resetCode}"
            );

            return Ok("Reset code sent");
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword(
            [FromBody] ResetPasswordDto request
        )
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u =>
                    u.Email == request.Email &&
                    u.VerificationCode == request.Code
                );

            if (user == null)
            {
                return BadRequest("Invalid reset code");
            }

            user.Password = request.NewPassword;
            user.VerificationCode = null;

            await _context.SaveChangesAsync();

            return Ok("Password reset successfully");
        }
    }
}