using Ballast.Core.ValueObjects;
using Ballast.Core.Messaging;
using Ballast.Core.Messaging.Events;
using System;
using System.Threading.Tasks;

namespace Ballast.Core.Services
{
    public class ChatService : IChatService
    {

        private readonly IEventBus _eventBus;
        private readonly ISignInService _signInService;

        public ChatService(IEventBus eventBus, ISignInService signInService)
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
            //throw new NotImplementedException();
        }
    }
}