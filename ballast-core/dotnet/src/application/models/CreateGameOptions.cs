namespace Ballast.Core.Application.Models
{
    public class CreateGameOptions
    {
        public CreateVesselOptions[] VesselOptions { get; set; }
        public string BoardType { get; set; }
        public int? BoardSize { get; set; }
        public string BoardShape { get; set; }
        public double? LandToWaterRatio { get; set; }
    }
}