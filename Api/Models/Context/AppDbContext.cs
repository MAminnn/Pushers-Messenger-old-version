
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
namespace Api.Models.Context
{
    public class AppDbContext : IdentityDbContext<IdentityUser<int>,IdentityRole<int>,int>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options):base(options)
        {
           
        }
    }
}
