using System.Threading.Tasks;
using Ballast.Core.Application.Models;
using Ballast.Core.Application.Services;

namespace Ballast.Client.SignalR.Services
{
    public class SignalRClientChatService : SignalRClientServiceBase, IChatService
    {

        public SignalRClientChatService(ISignalRClientOptions options) : base(options) { }

        protected override string HubName => "chathub";

        public Task SendMessageAsync(ChatMessage message) =>
            CreateInvocationAsync("SendMessageAsync", message);

    }
}