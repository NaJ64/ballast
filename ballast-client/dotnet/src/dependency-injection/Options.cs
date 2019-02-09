using System;

namespace Ballast.Client.DependencyInjection 
{
    public interface IBallastClientOptions 
    { 
        bool UseSignalR { get; set;}
        string ServerUrl { get; set; }
        Guid? ClientId { get; set; }
    }

    public class BallastClientOptions : IBallastClientOptions 
    { 

        public bool UseSignalR { get; set; }
        public string ServerUrl { get; set; }
        public Guid? ClientId { get; set; }

        public BallastClientOptions() 
        { 
            UseSignalR = true;
            ServerUrl = null;
            ClientId = null;
        }

    }
}