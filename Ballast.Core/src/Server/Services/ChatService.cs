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

        public ChatService(IEventBus eventBus)
        {
            _eventBus = eventBus;
        }

        public void Dispose() { }

        public async Task SendMessageAsync(ChatMessage message) 
        {
            await _eventBus.PublishAsync(ChatMessageSentEvent.FromMessage(message));
            //throw new NotImplementedException();
        }
    }
}