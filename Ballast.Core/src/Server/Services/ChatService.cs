using Ballast.Core.ValueObjects;
using Ballast.Core.ValueObjects.Interfaces;
using System;
using System.Threading.Tasks;

namespace Ballast.Core.Services
{
    public class ChatService : IChatService
    {
        public Task SendMessageAsync(IChatMessage message) 
        {
            throw new NotImplementedException();
        }
    }
}