using System;
using System.Threading.Tasks;
using Ballast.Core.Application.Models;

namespace Ballast.Core.Application.Services
{
    public interface IChatService : IDisposable
    {
        Task SendMessageAsync(ChatMessage message);
    }
}