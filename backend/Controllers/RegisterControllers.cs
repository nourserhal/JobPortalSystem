using Microsoft.AspNetCore.Mvc;
using ContactApi.Models;
using Microsoft.EntityFrameworkCore;
using ContactApi.Services;

namespace ContactApi.Controllers
{
    public class VerifyEmailDto
    {
        public string Email { get; set; } = "";
        public string Code { get; set; } = "";
    }

    [ApiController]
    [Route("api/[controller]")]
    public class RegisterController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly EmailService _emailService;

        public RegisterController(
            AppDbContext context,
            EmailService emailService
        )
        {
            _context = context;
            _emailService = emailService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] User user)
        {
            var existingUser = await _context.Users
                .FirstOrDefaultAsync(u =>
                    u.Email == user.Email &&
                    u.Role == user.Role
                );

            if (existingUser != null)
            {
                return BadRequest("User already exists");
            }

            var verificationCode = new Random()
                .Next(100000, 999999)
                .ToString();

            user.VerificationCode = verificationCode;
            user.IsEmailVerified = false;

            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            Console.WriteLine($"CODE FOR {user.Email}: {verificationCode}");
            await _emailService.SendEmailAsync(
                user.Email,
                "Verify Your Email",
                $"Your verification code is: {verificationCode}"
            );

            return Ok(new
            {
                message = "Registration successful. Verification code sent to email."
            });
        }

        [HttpPost("verify-email")]
        public async Task<IActionResult> VerifyEmail(
            [FromBody] VerifyEmailDto request
        )
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u =>
                    u.Email == request.Email &&
                    u.VerificationCode == request.Code
                );

            if (user == null)
            {
                return BadRequest("Invalid verification code");
            }

            user.IsEmailVerified = true;
            user.VerificationCode = null;

            await _context.SaveChangesAsync();

            return Ok("Email verified successfully");
        }

        [HttpPost("resend-code")]
        public async Task<IActionResult> ResendCode(
            [FromBody] VerifyEmailDto request
        )
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == request.Email);

            if (user == null)
            {
                return BadRequest("User not found");
            }

            if (user.IsEmailVerified)
            {
                return BadRequest("Email is already verified");
            }

            var verificationCode = new Random()
                .Next(100000, 999999)
                .ToString();

            user.VerificationCode = verificationCode;

            await _context.SaveChangesAsync();

            await _emailService.SendEmailAsync(
                user.Email,
                "Verify Your Email",
                $"Your new verification code is: {verificationCode}"
            );

            return Ok("Verification code resent");
        }
    }
}