using Ballast.Core.ValueObjects;
using System;
using System.Threading.Tasks;

namespace Ballast.Core.Services
{
    public interface IChatService : IDisposable
    {
        Task SendMessageAsync(ChatMessage message);
    }
}