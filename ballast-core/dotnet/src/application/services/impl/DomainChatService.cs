using System;
using System.Threading.Tasks;
using Ballast.Core.Application.Events;
using Ballast.Core.Application.Models;
using Ballast.Core.Messaging;

namespace Ballast.Core.Application.Services.Impl 
{
    public class DomainChatService : IChatService
    {

        private readonly IEventBus _eventBus;
        private readonly ISignInService _signInService;

        public DomainChatService(IEventBus eventBus, ISignInService signInService)
        {
            _eventBus = eventBus;
            _signInService = signInService;
        }

        public void Dispose() { }

        public async Task SendMessageAsync(ChatMessage message) 
        {
            var player = await _signInService.GetSignedInPlayerAsync(message.FromPlayerId);
            message.FromPlayerName = player.Name;
            await _eventBus.PublishAsync(ChatMessageSentEvent.FromMessage(message));
        }
    }
}