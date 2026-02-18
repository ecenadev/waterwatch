using Microsoft.EntityFrameworkCore;
using WaterWatch.Models;
    

    namespace WaterWatch.Data{

    public interface IDataContext
    {
        DbSet<WaterConsumption> Consumptions { get; set; }
        DbSet<Waterpipes> Waterpipes { get; set; }
        DbSet<WaterPoint> Point { get; set; }

        int SaveChanges();
        Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    }

}