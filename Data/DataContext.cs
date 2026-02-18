using Microsoft.EntityFrameworkCore;
using WaterWatch.Models;



namespace WaterWatch.Data
{
    public class DataContext :DbContext, IDataContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {

        }
        
        public DbSet<WaterConsumption> Consumptions { get; set; }
        public DbSet<Waterpipes> Waterpipes { get; set; }
        
        public DbSet<WaterPoint> Point { get; set; }

        
    }
}