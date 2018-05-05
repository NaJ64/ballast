using Ballast.Core.ValueObjects;
using Ballast.Core.ValueObjects.Interfaces;
using System.Threading.Tasks;

namespace Ballast.Core.Services
{
    public interface IChatService
    {
        Task SendMessageAsync(IChatMessage message);
    }
}