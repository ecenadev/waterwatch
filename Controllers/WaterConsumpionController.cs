using Microsoft.AspNetCore.Mvc;
using WaterWatch.Repositories;
using WaterWatch.Models;
using Microsoft.EntityFrameworkCore.Scaffolding.Metadata;

namespace WaterWatch.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class WaterConsumptionController : ControllerBase
    {
        private readonly IWaterConsumptionRepository _waterConsumptionRepository;
        // private readonly 
        public WaterConsumptionController(IWaterConsumptionRepository waterConsumptionRepository)
        {
            _waterConsumptionRepository = waterConsumptionRepository;

        }

        [HttpGet("/waterlines/getall")]
        public async Task<ActionResult<IEnumerable<WaterConsumption>>> GetAllPipes()
        {
            var wpData = await _waterConsumptionRepository.GetAllPipes();
            return Ok(wpData);
        }

        [HttpGet("/waterconsumption/getall")]
        public async Task<ActionResult<IEnumerable<WaterConsumption>>> GetAll()
        {
            var wcData = await _waterConsumptionRepository.GetAll();
            var wpData = await _waterConsumptionRepository.GetAllPipes();
            var merged = wcData.Select(wc => new
            {
                wc.id,
                wc.neighbourhood,
                wc.suburb_group,
                averageMonthlyKL = (int?)wc.averageMonthlyKL,
                coordinates = wc.coordinates
            })
.Concat(
    wpData.Select(wp => new
    {
        wp.id,
        wp.neighbourhood,
        wp.suburb_group,
        averageMonthlyKL = int.TryParse(wp.averageMonthlyKL, out var v)
            ? v
            : (int?)null,
        coordinates = wp.coordinates
    })
)
.ToList();

            return Ok(merged);


        }


        [HttpGet("/waterconsumption/topten")]

        public async Task<ActionResult<IEnumerable<WaterConsumption>>> GetTopTen()
        {
            var wcData = await _waterConsumptionRepository.GetTopTenConsumers();
            return Ok(wcData);
        }

         [HttpPost("/waterconsumption/addline")]

        
        public async Task<IActionResult> AddLine([FromBody] WaterWatch.Models.WaterConsumption dto)
        {
            try
            {
                var waterConsumption = new WaterWatch.Models.Waterpipes
                {
                    neighbourhood = dto.neighbourhood,
                    suburb_group = dto.suburb_group,
                    averageMonthlyKL = dto.averageMonthlyKL.ToString(),
                    coordinates = dto.coordinates
                };

                await _waterConsumptionRepository.AddDataLines(waterConsumption);

                return Ok(new
                {
                    success = true,
                    message = "Water consumption data added successfully",
                    id = waterConsumption.id
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    success = false,
                    message = $"Error adding water consumption: {ex.Message}"
                });
            }

        }

         [HttpPost("/waterconsumption/addpoly")]

        public async Task<IActionResult> AddPoly([FromBody] WaterWatch.Models.WaterConsumption dto)
        {
            try
            {
                var waterConsumption = new WaterWatch.Models.WaterConsumption
                {
                    neighbourhood = dto.neighbourhood,
                    suburb_group = dto.suburb_group,
                    averageMonthlyKL = dto.averageMonthlyKL,
                    coordinates = dto.coordinates
                };

                await _waterConsumptionRepository.AddPoly(waterConsumption);

                return Ok(new
                {
                    success = true,
                    message = "Water consumption data added successfully",
                    id = waterConsumption.id
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    success = false,
                    message = $"Error adding water consumption: {ex.Message}"
                });
            }

        }
        [HttpPut("/waterlines/update")]
        public async Task<ActionResult> EditLines([FromBody] WaterWatch.Models.Waterpipes dto)
        {
            Console.WriteLine("I am in");
            try
            {
                var waterpipes = new WaterWatch.Models.Waterpipes
                {
                    id = dto.id,
                    neighbourhood = dto.neighbourhood,
                    suburb_group = dto.suburb_group,
                    averageMonthlyKL = dto.averageMonthlyKL,
                    coordinates = dto.coordinates
                };

                await _waterConsumptionRepository.UpdateDataLines(waterpipes);

                return Ok(new
                {
                    success = true,
                    message = "Water consumption data updated successfully",
                    id = waterpipes.id
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    success = false,
                    message = $"Error adding water consumption: {ex.Message}"
                });
            }

        }


        [HttpPut("/waterconsumption/updatepolygon")]
        public async Task<ActionResult> EditPolygon([FromBody] WaterWatch.Models.WaterConsumption dto)
        {
            Console.WriteLine("I am in");
            try
            {
                var waterConsumption = new WaterWatch.Models.WaterConsumption
                {
                    id = dto.id,
                    neighbourhood = dto.neighbourhood,
                    suburb_group = dto.suburb_group,
                    averageMonthlyKL = dto.averageMonthlyKL,
                    coordinates = dto.coordinates
                };

                await _waterConsumptionRepository.UpdateData(waterConsumption);

                return Ok(new
                {
                    success = true,
                    message = "Water consumption data updated successfully",
                    id = waterConsumption.id
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    success = false,
                    message = $"Error adding water consumption: {ex.Message}"
                });
            }

        }


        public class DeleteRequest
        {
            public int Id { get; set; }
            public string Type { get; set; }
        }

        [HttpDelete("/waterconsumption/delete")]
        public async Task<ActionResult> Delete([FromBody] DeleteRequest request)
        {
            Console.WriteLine($"Delete request - ID: {request.Id}, Type: {request.Type}");
            try
            {
                Console.WriteLine($"Calling DeletePoly with ID: {request.Id}");

                await _waterConsumptionRepository.DeletePoly(request.Id);

                Console.WriteLine($"DeletePoly completed");

                return Ok(new
                {
                    success = true,
                    message = "Water consumption data deleted successfully",
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Delete error: {ex.Message}");
                return BadRequest(new
                {
                    success = false,
                    message = $"Error deleting water consumption: {ex.Message}"
                });
            }
        }

        // [HttpPost("/waterconsumption/addline")]
        // public async Task<ActionResult<IEnumerable<WaterConsumption>>> AddLine()
        // {

        // }
        // [HttpPost("/waterconsumption/addplace")]
        // public async Task<ActionResult<IEnumerable<WaterConsumption>>> AddPlace()
        // {

        // }


    }
}