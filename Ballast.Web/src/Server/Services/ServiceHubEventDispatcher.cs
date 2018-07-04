using Ballast.Core.Messaging;
using Ballast.Core.Messaging.Events;
using Ballast.Web.Hubs;
using Ballast.Web.HubMethods;
using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace Ballast.Web.Services
{

    public class ServiceHubEventDispatcher : IDisposable
    {

        private static ServiceHubEventDispatcher _instance = null;
        private static Object _mutex = new Object();

        private readonly IEventBus _eventBus;
        private readonly SignInHubMethods _signInHubMethods;
        private readonly GameHubMethods _gameHubMethods;

        private ServiceHubEventDispatcher(IEventBus eventBus, SignInHubMethods signInHubMethods, GameHubMethods gameHubMethods)
        {
            _eventBus = eventBus;
            _signInHubMethods = signInHubMethods;
            _gameHubMethods = gameHubMethods;
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
                        var signInHubMethods = (SignInHubMethods)serviceProvider.GetService(typeof(SignInHubMethods));
                        var gameHubMethods = (GameHubMethods)serviceProvider.GetService(typeof(GameHubMethods));
                        _instance = new ServiceHubEventDispatcher(eventBus, signInHubMethods, gameHubMethods);
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
            _eventBus.Subscribe<PlayerJoinedGameEvent>(nameof(PlayerJoinedGameEvent), OnPlayerJoinedGame);
            _eventBus.Subscribe<PlayerLeftGameEvent>(nameof(PlayerLeftGameEvent), OnPlayerLeftGame);
        }

        private void UnsubscribeAll()
        {
            _eventBus.Unsubscribe<PlayerJoinedGameEvent>(nameof(PlayerJoinedGameEvent), OnPlayerJoinedGame);
            _eventBus.Unsubscribe<PlayerLeftGameEvent>(nameof(PlayerLeftGameEvent), OnPlayerLeftGame);
        }

        private async Task OnPlayerJoinedGame(PlayerJoinedGameEvent evt)
        {
            await _gameHubMethods.OnPlayerJoinedGameAsync(evt);
        }

        private async Task OnPlayerLeftGame(PlayerLeftGameEvent evt)
        {
            await _gameHubMethods.OnPlayerLeftGameAsync(evt);
        }

    }
}