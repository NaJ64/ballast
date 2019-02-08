namespace Ballast.Client.DependencyInjection 
{
    public interface IBallastClientOptions 
    { 
        bool UseSignalR { get; set;}
    }

    public class BallastClientOptions : IBallastClientOptions 
    { 

        public bool UseSignalR { get; set; }

        public BallastClientOptions() 
        { 
            UseSignalR = true;
        }

    }
}