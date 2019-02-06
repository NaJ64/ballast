using Ballast.Core.Messaging;
using Ballast.Core.Application.Events;
using Ballast.Web.Hubs;
using Ballast.Web.HubMethods;
using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace Ballast.Web.Services
{

    public class ServiceHubEventDispatcher : IDisposable
    {

        private static ServiceHubEventDispatcher _instance = null;
        private static Object _mutex = new Object();

        private readonly IEventBus _eventBus;
        private readonly ChatHubMethods _chatHubMethods;
        private readonly GameHubMethods _gameHubMethods;
        private readonly SignInHubMethods _signInHubMethods;

        private ServiceHubEventDispatcher(IEventBus eventBus, ChatHubMethods chatHubMethods, GameHubMethods gameHubMethods, SignInHubMethods signInHubMethods)
        {
            _eventBus = eventBus;
            _gameHubMethods = gameHubMethods;
            _chatHubMethods = chatHubMethods;
            _signInHubMethods = signInHubMethods;
            SubscribeAll();
        }

        public static ServiceHubEventDispatcher GetInstance(IServiceProvider serviceProvider)
        {
            if (_instance == null)
            {
                lock (_mutex) // thread safety lock
                {
                    if (_instance == null)
                    {
                        var eventBus = (IEventBus)serviceProvider.GetService(typeof(IEventBus));
                        var chatHubMethods = (ChatHubMethods)serviceProvider.GetService(typeof(ChatHubMethods));
                        var gameHubMethods = (GameHubMethods)serviceProvider.GetService(typeof(GameHubMethods));
                        var signInHubMethods = (SignInHubMethods)serviceProvider.GetService(typeof(SignInHubMethods));
                        _instance = new ServiceHubEventDispatcher(eventBus, chatHubMethods, gameHubMethods, signInHubMethods);
                    }
                }
            }
            return _instance;
        }

        public void Dispose()
        {
            UnsubscribeAll();
        }

        private void SubscribeAll()
        {
            _eventBus.Subscribe<PlayerJoinedGameEvent>(nameof(PlayerJoinedGameEvent), OnPlayerJoinedGameAsync);
            _eventBus.Subscribe<PlayerLeftGameEvent>(nameof(PlayerLeftGameEvent), OnPlayerLeftGameAsync);
            _eventBus.Subscribe<ChatMessageSentEvent>(nameof(ChatMessageSentEvent), OnChatMessageSentAsync);
            _eventBus.Subscribe<VesselStateChangedEvent>(nameof(VesselStateChangedEvent), OnVesselStateChangedAsync);
        }

        private void UnsubscribeAll()
        {
            _eventBus.Unsubscribe<PlayerJoinedGameEvent>(nameof(PlayerJoinedGameEvent), OnPlayerJoinedGameAsync);
            _eventBus.Unsubscribe<PlayerLeftGameEvent>(nameof(PlayerLeftGameEvent), OnPlayerLeftGameAsync);
            _eventBus.Unsubscribe<ChatMessageSentEvent>(nameof(ChatMessageSentEvent), OnChatMessageSentAsync);
            _eventBus.Unsubscribe<VesselStateChangedEvent>(nameof(VesselStateChangedEvent), OnVesselStateChangedAsync);
        }

        private async Task OnPlayerJoinedGameAsync(PlayerJoinedGameEvent evt)
        {
            await _gameHubMethods.OnPlayerJoinedGameAsync(evt);
        }

        private async Task OnPlayerLeftGameAsync(PlayerLeftGameEvent evt)
        {
            await _gameHubMethods.OnPlayerLeftGameAsync(evt);
        }

        private async Task OnChatMessageSentAsync(ChatMessageSentEvent evt)
        {
            // if (evt.Message.GameId != null) 
            // {
            //     var playerConnections = await _gameHubMethods.GetPlayerConnectionsForGameAsync(evt.Message.GameId.GetValueOrDefault());
            // }
            await _chatHubMethods.OnChatMessageSentAsync(evt);
        }

        private async Task OnVesselStateChangedAsync(VesselStateChangedEvent evt)
        {
            await _gameHubMethods.OnVesselStateChanged(evt);
        }

    }
}