using System;
using System.Collections.Generic;
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
        private readonly IList<Type> _subscribeToEvents = new List<Type> 
        {
            typeof(ChatMessageSentEvent),
            typeof(GameStateChangedEvent),
            typeof(PlayerAddedToVesselRoleEvent),
            typeof(PlayerJoinedGameEvent),
            typeof(PlayerLeftGameEvent),
            typeof(PlayerRemovedFromVesselRoleEvent),
            typeof(PlayerSignedInEvent),
            typeof(PlayerSignedOutEvent),
            typeof(VesselStateChangedEvent)
        };

        public EventHubMethods(
            IHubContext<EventHub> hubContext, 
            IPlayerConnectionRepository<EventHub> playerConnections, 
            IEventBus eventBus
        ) : base(hubContext, playerConnections) 
        { 
            _eventBus = eventBus;
            _handlers = new Dictionary<Type, Delegate>();
            SubscribeAll(_eventBus);
        }

        private void SubscribeAll(IEventBus eventBus)
        {
            var subscribeMethod = eventBus.GetType()
                .GetMethod(nameof(IEventBus.Subscribe));
            foreach(var eventType in _subscribeToEvents)
            {
                var eventIdMethod = eventType.GetMethod("GetId");
                if (eventIdMethod == null)
                    throw new MissingMemberException($"Event type ${eventType.Name} is missing static method 'GetId'");
                var eventId = eventIdMethod.Invoke(null, null) as string;
                var subscribeGeneric = subscribeMethod.MakeGenericMethod(eventType);
                // Create handler for specific typed event
                var typedEventHandlerMethod = typeof(EventHubMethods).GetMethod(nameof(OnTypedEventAsync));
                var typedEventHandlerGeneric = typedEventHandlerMethod.MakeGenericMethod(eventType);
                Delegate handler = Delegate.CreateDelegate(typeof(EventHubMethods),this, typedEventHandlerGeneric);
                _handlers[eventType] = handler;
                subscribeGeneric.Invoke(eventBus, new object[] { eventId, handler });
            }
        }

        private Task OnTypedEventAsync<TEvent>(TEvent evt) where TEvent : IEvent => OnEventAsync(evt);

        private Task OnEventAsync(IEvent evt)
        {
            // TODO:  Send to client
            return Task.CompletedTask;
        }

        // public async Task OnChatMessageSentAsync(ChatMessageSentEvent evt)
        // {
        //     // Lookup all clients that are already in the game and notify them
        //     var connectionIds = _playerConnections.GetAll();
        //     foreach(var connectionId in connectionIds)
        //     {
        //         var playerId = _playerConnections.GetPlayerId(connectionId);
        //         var client = _hubContext.Clients.Client(connectionId);
        //         await client?.SendAsync("ChatMessageSent", evt);
        //     }
        // }

    }
}