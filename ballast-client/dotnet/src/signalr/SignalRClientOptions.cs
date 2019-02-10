using System;

namespace Ballast.Client.SignalR 
{
    public interface ISignalRClientOptions
    { 
        string ServerUrl { get; set; }
        Guid ClientId { get; set; }
    }

    public class SignalRClientOptions : ISignalRClientOptions 
    { 

        public string ServerUrl { get; set; }
        public Guid ClientId { get; set; }

        public SignalRClientOptions(string serverUrl, Guid clientId) 
        { 
            ServerUrl = serverUrl;
            ClientId = clientId;
        }

    }
}