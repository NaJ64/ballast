using System.Collections.Generic;

namespace Ballast.Server.DependencyInjection 
{
    public interface IBallastServerOptions 
    { 
        bool UseSignalR { get; set; }
        string DefaultBoardType { get; set; }
        string DefaultTileShape { get; set; }
        int? DefaultBoardSize { get; set; }
        double? DefaultLandToWaterRatio { get; set; }
        IEnumerable<string> DefaultVessels { get; set; }
    }

    public class BallastServerOptions : IBallastServerOptions 
    { 

        public bool UseSignalR { get; set; }
        public string DefaultBoardType { get; set; }
        public string DefaultTileShape { get; set; }
        public int? DefaultBoardSize { get; set; }
        public double? DefaultLandToWaterRatio { get; set; }
        public IEnumerable<string> DefaultVessels { get; set; }

        public BallastServerOptions() 
        { 
            UseSignalR = true;
        }

    }
}