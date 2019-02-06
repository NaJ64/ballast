namespace Ballast.Core.Application.Models
{
    public class RemovePlayerOptions
    {
        public string PlayerId { get; set; }
        public string GameId { get; set; }
        public string VesselId { get; set; }
        public string[] VesselRoles { get; set; }
    }
}