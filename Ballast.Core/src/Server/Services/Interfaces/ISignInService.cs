using Ballast.Core.Models;
using Ballast.Core.ValueObjects;
using System;
using System.Threading.Tasks;

namespace Ballast.Core.Services
{
    public interface ISignInService : IDisposable
    {
        Task<IPlayer> SignInAsync(PlayerSignInRequest request);
        Task SignOutAsync(PlayerSignOutRequest request);
        Task<IPlayer> GetSignedInPlayerAsync(Guid playerId);
    }
}