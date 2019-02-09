using System.Threading.Tasks;
using Ballast.Core.Application.Models;
using Ballast.Core.Application.Services;

namespace Ballast.Client.SignalR.Services
{
    public class SignalRClientChatService : IChatService
    {
        public void Dispose()
        {
            throw new System.NotImplementedException();
        }

        public Task SendMessageAsync(ChatMessage message)
        {
            throw new System.NotImplementedException();
        }
    }
}