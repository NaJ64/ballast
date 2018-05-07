using Ballast.Core.ValueObjects;
using System.Threading.Tasks;

namespace Ballast.Core.Services
{
    public interface IChatService
    {
        Task SendMessageAsync(IChatMessage message);
    }
}