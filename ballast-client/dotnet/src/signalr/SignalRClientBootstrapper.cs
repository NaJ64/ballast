using System.Collections.Generic;
using System.Threading.Tasks;
using Ballast.Client.SignalR.Services;
using Ballast.Core.Application.Services;

namespace Ballast.Client.SignalR
{
    public class SignalRClientBootstrapper : IClientBootstrapper
    {

        private readonly SignalRClientEventSubscriber _eventSubscriber;
        private readonly SignalRClientChatService _chatService;
        private readonly SignalRClientGameService _gameService;
        private readonly SignalRClientSignInService _signInService;

        public SignalRClientBootstrapper(
            ISignalRClientEventSubscriber eventSubscriber,
            IChatService chatService,
            IGameService gameService,
            ISignInService signInService
        ) 
        {
            _eventSubscriber = eventSubscriber as SignalRClientEventSubscriber;
            _chatService = chatService as SignalRClientChatService;
            _gameService = gameService as SignalRClientGameService;
            _signInService = signInService as SignalRClientSignInService;
        }

        public async Task ConnectAsync()
        {
            var tasks = new List<Task>();
            // tasks.Add(this._eventSubscriber.ConnectAsync());
            // tasks.Add(this._chatService.ConnectAsync());
            // tasks.Add(this._gameService.ConnectAsync());
            // tasks.Add(this._signInService.ConnectAsync());
            await Task.WhenAll(tasks);
        }
    }
}