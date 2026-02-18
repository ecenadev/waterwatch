namespace WaterWatch.Models
{

    public class Waterpipes
    {
        public int id { get; set; }

        public string neighbourhood { get; set; }

        public string suburb_group { get; set; }

        public string averageMonthlyKL { get; set; }

         public string coordinates { get; set; }

    // add a property to store the geometry (optional)
    //  [NotMapped]
    // public string GeometryGeoJson { get; set; }


    }
}