using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using Ballast.Core.Application.Events;
using Ballast.Core.Application.Services;
using Ballast.Core.Messaging;
using Ballast.Server.SignalR.Hubs;
using Ballast.Server.SignalR.Repositories;
using Microsoft.AspNetCore.SignalR;

namespace Ballast.Server.SignalR.HubMethods
{
    public class EventHubMethods : ServiceHubMethodsBase<EventHub>
    {

        private readonly IEventBus _eventBus;
        private readonly IDictionary<Type, Delegate> _handlers;

        public EventHubMethods(
            IHubContext<EventHub> hubContext, 
            IPlayerConnectionRepository<EventHub> playerConnections, 
            IEventBus eventBus
        ) : base(hubContext, playerConnections) 
        { 
            _eventBus = eventBus;
            _handlers = new Dictionary<Type, Delegate>();
            SubscribeAll();
        }

        public override void Dispose()
        {
            UnsubscribeAll();
        }

        private IEnumerable<Type> GetApplicationEventTypes()
        {
            Assembly a = typeof(IApplicationEvent).Assembly;
            var applicationEventTypes = a.GetTypes()
                .Where(type => 
                    type != typeof(IApplicationEvent) && 
                    typeof(IApplicationEvent).IsAssignableFrom(type))
                .ToList();
            return applicationEventTypes;
            // return new List<Type> 
            // {
            //     typeof(ChatMessageSentEvent),
            //     typeof(GameStateChangedEvent),
            //     typeof(PlayerAddedToVesselRoleEvent),
            //     typeof(PlayerJoinedGameEvent),
            //     typeof(PlayerLeftGameEvent),
            //     typeof(PlayerRemovedFromVesselRoleEvent),
            //     typeof(PlayerSignedInEvent),
            //     typeof(PlayerSignedOutEvent),
            //     typeof(VesselStateChangedEvent)
            // };
        }

        private void SubscribeAll()
        {
            var applicationEventTypes = GetApplicationEventTypes();
            foreach(var eventType in applicationEventTypes)
            {
                var eventId = GetEventId(eventType);
                var subscribeForEventType = GetSubscribeMethod(eventType);
                var onTypedEventAsync = GetTypedEventHandler(eventType);
                subscribeForEventType.Invoke(_eventBus, new object[] { eventId, onTypedEventAsync });
                _handlers[eventType] = onTypedEventAsync;
            }
        }

        private void UnsubscribeAll()
        {
            var applicationEventTypes = GetApplicationEventTypes();
            foreach(var eventType in applicationEventTypes)
            {
                var eventId = GetEventId(eventType);
                var unsubscribeForEventType = GetSubscribeMethod(eventType);
                var onTypedEventAsync = _handlers[eventType];
                unsubscribeForEventType.Invoke(_eventBus, new object[] { eventId, onTypedEventAsync });
                _handlers.Remove(eventType);
            }            
        }

        private string GetEventId(Type eventType)
        {
            var getEventIdMethod = eventType.GetMethod("GetId");
            if (getEventIdMethod == null)
                throw new MissingMemberException($"Event type ${eventType.Name} is missing static method 'GetId'");
            return getEventIdMethod.Invoke(null, null) as string;
        }

        private MethodInfo GetSubscribeMethod(Type eventType)
        {
            var subscribeMethod = _eventBus.GetType().GetMethod(nameof(IEventBus.Subscribe));
            return subscribeMethod.MakeGenericMethod(eventType);
        }

        private MethodInfo GetUnsubscribeMethod(Type eventType)
        {
            var subscribeMethod = _eventBus.GetType().GetMethod(nameof(IEventBus.Unsubscribe));
            return subscribeMethod.MakeGenericMethod(eventType);
        }

        private Delegate GetTypedEventHandler(Type eventType)
        {
            var eventHandlerMethod = typeof(EventHubMethods).GetMethod(nameof(OnTypedEventAsync));
            var eventHandlerForEventType = eventHandlerMethod.MakeGenericMethod(eventType);
            return Delegate.CreateDelegate(typeof(EventHubMethods), this, eventHandlerForEventType);
        }

        private Task OnTypedEventAsync<TEvent>(TEvent evt) where TEvent : IApplicationEvent => OnEventAsync(evt);

        private async Task OnEventAsync(IApplicationEvent evt)
        {
            // Lookup all clients that are already in the game and notify them
            var connectionIds = _playerConnections.GetAll();
            foreach(var connectionId in connectionIds)
            {
                var playerId = _playerConnections.GetPlayerId(connectionId);
                var client = _hubContext.Clients.Client(connectionId);
                await client?.SendAsync("IApplicationEvent", evt);
            }
        }

    }
}