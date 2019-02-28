using System.Collections.Generic;
using System.Threading.Tasks;
using Ballast.Client.SignalR.Services;
using Ballast.Core.Application.Services;

namespace Ballast.Client.SignalR
{
    public class SignalRClientBootstrapper : IClientBootstrapper
    {

        private readonly SignalRClientApplicationEventEmitter _applicationEventEmitter;
        private readonly SignalRClientChatService _chatService;
        private readonly SignalRClientGameService _gameService;
        private readonly SignalRClientSignInService _signInService;

        public SignalRClientBootstrapper(
            IApplicationEventEmitter applicationEventEmitter,
            IChatService chatService,
            IGameService gameService,
            ISignInService signInService
        ) 
        {
            _applicationEventEmitter = applicationEventEmitter as SignalRClientApplicationEventEmitter;
            _chatService = chatService as SignalRClientChatService;
            _gameService = gameService as SignalRClientGameService;
            _signInService = signInService as SignalRClientSignInService;
        }

        public async Task ConnectAsync()
        {
            var tasks = new List<Task>();
            tasks.Add(_applicationEventEmitter.ConnectAsync());
            tasks.Add(_chatService.ConnectAsync());
            tasks.Add(_gameService.ConnectAsync());
            tasks.Add(_signInService.ConnectAsync());
            await Task.WhenAll(tasks);
            _applicationEventEmitter.Start();
        }
    }
}