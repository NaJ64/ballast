using Ballast.Core.Application.Models;
using System;
using System.Threading.Tasks;

namespace Ballast.Core.Application.Services
{
    public interface IChatService : IDisposable
    {
        Task SendMessageAsync(ChatMessage message);
    }
}