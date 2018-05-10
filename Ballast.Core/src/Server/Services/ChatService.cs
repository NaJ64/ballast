using Ballast.Core.ValueObjects;
using System;
using System.Threading.Tasks;

namespace Ballast.Core.Services
{
    public class ChatService : IChatService
    {
        public void Dispose() { }
        public Task SendMessageAsync(ChatMessage message) 
        {
            throw new NotImplementedException();
        }
    }
}