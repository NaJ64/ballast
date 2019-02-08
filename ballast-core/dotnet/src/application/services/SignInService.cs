using System;
using System.Threading.Tasks;
using Ballast.Core.Application.Models;

namespace Ballast.Core.Application.Services
{
    public interface ISignInService : IDisposable
    {
        Task<PlayerDto> SignInAsync(PlayerSignInRequest request);
        Task SignOutAsync(PlayerSignOutRequest request);
        Task<PlayerDto> GetSignedInPlayerAsync(Guid playerId);
    }
}