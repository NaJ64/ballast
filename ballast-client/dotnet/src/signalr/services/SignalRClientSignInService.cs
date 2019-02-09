using System;
using System.Threading.Tasks;
using Ballast.Core.Application.Models;
using Ballast.Core.Application.Services;

namespace Ballast.Client.SignalR.Services
{
    public class SignalRClientSignInService : ISignInService
    {
        public void Dispose()
        {
            throw new NotImplementedException();
        }

        public Task<PlayerDto> GetSignedInPlayerAsync(Guid playerId)
        {
            throw new NotImplementedException();
        }

        public Task<PlayerDto> SignInAsync(PlayerSignInRequest request)
        {
            throw new NotImplementedException();
        }

        public Task SignOutAsync(PlayerSignOutRequest request)
        {
            throw new NotImplementedException();
        }
    }
}