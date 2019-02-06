namespace Ballast.Core.Application.Models
{
    public class VesselMoveRequest
    {
        public string GameId { get; set; }
        public string VesselId { get; set; }
        public string SentOnDateIsoString { get; set; }
        public int[] SourceOrderedTriple { get; set; }
        public int[] TargetOrderedTriple { get; set; }
        public Direction Direction { get; set; }
    }
}