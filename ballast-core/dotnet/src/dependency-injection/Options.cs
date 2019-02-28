using System.Collections.Generic;
using Ballast.Core.Domain.Models;
using Ballast.Core.Application.Services.Impl;

namespace Ballast.Core.DependencyInjection 
{
    public interface IBallastCoreOptions : IDomainGameServiceOptions
    { 
        bool UseDomain { get; set; }
        bool UseLocalEventBus { get; set; }
    }

    public class BallastCoreOptions : IBallastCoreOptions
    {

        public bool UseDomain { get; set; }
        public bool UseLocalEventBus { get; set; }
        public string DefaultBoardType { get; set; }
        public string DefaultTileShape { get; set; }
        public int? DefaultBoardSize { get; set; }
        public double? DefaultLandToWaterRatio { get; set; }
        public IEnumerable<string> DefaultVessels { get; set; }

        public BallastCoreOptions() 
        { 
            UseDomain = true;
            UseLocalEventBus = true;
        }

    }
}