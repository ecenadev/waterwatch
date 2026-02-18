using WaterWatch.Models;

namespace WaterWatch.Repositories
{
    public interface IWaterConsumptionRepository
    {
        Task<IEnumerable<WaterConsumption>> GetAll();
        Task<IEnumerable<WaterConsumption>> GetTopTenConsumers();
        Task AddPoly(WaterConsumption waterConsumption); 
        Task  DeletePoly(int id); 
        
        
        // Task  AddLine();

        // Task AddPlace();   
        Task  UpdateData(WaterConsumption waterConsumption);  
        Task  UpdateDataLines(Waterpipes waterConsumption);   
        Task  AddDataLines(Waterpipes waterConsumption);   



        Task<IEnumerable<Waterpipes>> GetAllPipes();
        




    }
}
