namespace Ballast.Server.DependencyInjection 
{
    public interface IBallastServerOptions 
    { 
        bool UseSignalR { get; set;}
    }

    public class BallastServerOptions : IBallastServerOptions 
    { 

        public bool UseSignalR { get; set; }

        public BallastServerOptions() 
        { 
            UseSignalR = true;
        }

    }
}