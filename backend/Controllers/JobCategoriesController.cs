using ContactApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ContactApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class JobCategoriesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public JobCategoriesController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<JobCategory>>> GetCategories()
        {
            return await _context.JobCategories.ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<JobCategory>> AddCategory(JobCategory category)
        {
            _context.JobCategories.Add(category);
            await _context.SaveChangesAsync();

            return Ok(category);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCategory(int id, JobCategory updatedCategory)
        {
            var category = await _context.JobCategories.FindAsync(id);

            if (category == null)
            {
                return NotFound("Category not found");
            }

            category.Name = updatedCategory.Name;

            await _context.SaveChangesAsync();

            return Ok(category);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            var category = await _context.JobCategories.FindAsync(id);

            if (category == null)
            {
                return NotFound("Category not found");
            }

            _context.JobCategories.Remove(category);
            await _context.SaveChangesAsync();

            return Ok("Category deleted");
        }
    }
}