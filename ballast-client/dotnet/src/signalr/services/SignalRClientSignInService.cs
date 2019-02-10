using System;
using System.Threading.Tasks;
using Ballast.Core.Application.Models;
using Ballast.Core.Application.Services;

namespace Ballast.Client.SignalR.Services
{
    public class SignalRClientSignInService : SignalRClientServiceBase, ISignInService
    {

        public SignalRClientSignInService(ISignalRClientOptions options) : base(options) { }

        protected override string HubName => "signinhub";

        public Task<PlayerDto> GetSignedInPlayerAsync(Guid playerId) =>
            CreateInvocationAsync<PlayerDto>("getSignedInPlayerAsync", playerId);

        public Task<PlayerDto> SignInAsync(PlayerSignInRequest request) =>
            CreateInvocationAsync<PlayerDto>("signInAsync", request);

        public Task SignOutAsync(PlayerSignOutRequest request) =>
            CreateInvocationAsync("signOutAsync", request);
        
    }
}