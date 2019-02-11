using Ballast.Client.SignalR.Services;
using Ballast.Core.Application.Events;
using Ballast.Core.Messaging;
using Microsoft.AspNetCore.SignalR.Client;

namespace Ballast.Client.SignalR
{
    public interface ISignalRClientEventSubscriber { }
    public class SignalRClientEventSubscriber : SignalRClientServiceBase, ISignalRClientEventSubscriber
    {

        private readonly IEventBus _eventBus;

        public SignalRClientEventSubscriber(ISignalRClientOptions options, IEventBus eventBus) : base(options)
        {
            _eventBus = eventBus;
        }

        protected override string HubName => "eventhub";

        protected override void AfterSubscribe(HubConnection hubConnection)
        {
            hubConnection.On<IApplicationEvent>("IApplicationEvent", OnApplicationEvent);
        }

        protected override void BeforeUnsubscribe(HubConnection hubConnection)
        {
            hubConnection.Remove("IApplicationEvent");
        }

        private void OnApplicationEvent(IApplicationEvent evt)
        {
            _ = _eventBus.PublishAsync(evt); // Fire and forget
        }

    }
}