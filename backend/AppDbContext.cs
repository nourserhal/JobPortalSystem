using ContactApi.Models; 
using Microsoft.EntityFrameworkCore;
public class AppDbContext : DbContext { 
    public AppDbContext(DbContextOptions options) : base(options) {}

public DbSet<User> Users { get; set; }
public DbSet<Job> Jobs { get; set; }
public DbSet<Application> Applications { get; set; }
public DbSet<SavedJob> SavedJobs { get; set; }
public DbSet<JobCategory> JobCategories { get; set; }
public DbSet<JobType> JobTypes { get; set; }
public DbSet<Notification> Notifications { get; set; }
}