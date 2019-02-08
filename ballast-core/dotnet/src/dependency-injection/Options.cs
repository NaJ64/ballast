namespace Ballast.Core.DependencyInjection 
{
    public interface IBallastCoreOptions 
    { 
        bool UseDomain { get; set; }
        bool UseLocalEventBus { get; set; }
    }

    public class BallastCoreOptions : IBallastCoreOptions
    {

        public bool UseDomain { get; set; }
        public bool UseLocalEventBus { get; set; }

        public BallastCoreOptions() 
        { 
            UseDomain = true;
            UseLocalEventBus = true;
        }

    }
}