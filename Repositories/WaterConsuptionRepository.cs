using WaterWatch.Models;
using WaterWatch.Data;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace WaterWatch.Repositories
{
    public class WaterConsumptionRepository : IWaterConsumptionRepository
    {
        private readonly IDataContext _context;
        public WaterConsumptionRepository(IDataContext context)
        {
            _context = context;
        }

        public async Task  AddPoly(WaterWatch.Models.WaterConsumption waterConsumption)
        {
            _context.Consumptions.Add(waterConsumption);
            await _context.SaveChangesAsync();
        }

        public async Task AddDataLines(Waterpipes waterConsumption)
        {
            
            _context.Waterpipes.Add(waterConsumption);
            await _context.SaveChangesAsync();

        }
        public async Task AddPlace()
        {

        }

public async Task DeletePoly(int id) 
{
    var consumption = await _context.Consumptions.FindAsync(id);
    
    if (consumption != null)
    {
        _context.Consumptions.Remove(consumption);
        await _context.SaveChangesAsync();
            }
            else
            {
                var waterPipe = await _context.Waterpipes.FindAsync(id);
                 _context.Waterpipes.Remove(waterPipe);
                 await _context.SaveChangesAsync();
            }
}


        public async Task UpdateData(WaterWatch.Models.WaterConsumption waterConsumption)
        {
            _context.Consumptions.Update(waterConsumption);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateDataLines(Waterpipes dto)
{
    var existing = await _context.Waterpipes.FindAsync(dto.id);

    if (existing == null)
        throw new Exception("Waterpipe not found");

    existing.neighbourhood = dto.neighbourhood;
    existing.suburb_group = dto.suburb_group;
    existing.averageMonthlyKL = dto.averageMonthlyKL;
    existing.coordinates = dto.coordinates;

    await _context.SaveChangesAsync();
}


        public async Task<IEnumerable<WaterConsumption>> GetAll()
        {
            SaveData();
            return await _context.Consumptions.ToListAsync();
        }

         public async Task<IEnumerable<Waterpipes>> GetAllPipes()
        {
            // SaveData();
            return await _context.Waterpipes.ToListAsync();
        }
        public async Task<IEnumerable<WaterConsumption>> GetTopTenConsumers()
        {
            var q = _context.Consumptions.OrderByDescending(avgKL => avgKL.averageMonthlyKL)
            .Take(10)
            .ToListAsync();

            return await q;
        }


        public void SaveData()
        {

            var res_dataset = _context.Consumptions.ToList();

            if (res_dataset.Count() == 0)
            {
                Console.WriteLine("No Data");
                var geoJSON = File.ReadAllText("D:\\water_consumption.geojson");
                dynamic jsonObj = JsonConvert.DeserializeObject(geoJSON);

                foreach (var feature in jsonObj["features"])
                {
                    string str_neighbourhood = feature["properties"]["neighbourhood"];
                    string str_suburb_group = feature["properties"]["suburb_group"];
                    string str_averageMonthlyKL = feature["properties"]["averageMonthlyKL"];
                    string str_geometry = feature["geometry"]["coordinates"]
                                            .ToString(Newtonsoft.Json.Formatting.None);

                    string conv_avgMonthlyKl = str_averageMonthlyKL.Replace(".0", "");

                    int avgMthlyKl = Convert.ToInt32(conv_avgMonthlyKl);

                    WaterConsumption wc = new()
                    {
                        neighbourhood = str_neighbourhood,
                        suburb_group = str_suburb_group,
                        averageMonthlyKL = avgMthlyKl,
                        coordinates = str_geometry
                    };
                    _context.Consumptions.Add(wc);
                    _context.SaveChanges();

                }
            }
            else
            {
                Console.WriteLine("Data Loaded"); 
            }

        }
    }
}