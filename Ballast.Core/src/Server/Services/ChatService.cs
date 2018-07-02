using Ballast.Core.ValueObjects;
using Ballast.Core.Messaging;
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

        public void Dispose() 
        { 
            
        }

        public Task SendMessageAsync(ChatMessage message) 
        {
            throw new NotImplementedException();
        }
    }
}