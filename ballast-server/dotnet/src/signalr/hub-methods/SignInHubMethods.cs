using Ballast.Core.Application.Services;
using Ballast.Server.SignalR.Hubs;
using Ballast.Server.SignalR.Repositories;
using Microsoft.AspNetCore.SignalR;

namespace Ballast.Server.SignalR.HubMethods
{
    public class SignInHubMethods : ServiceHubMethodsBase<SignInHub>
    {

        private readonly ISignInService _signInService;

        public SignInHubMethods(
            IHubContext<SignInHub> hubContext, 
            IPlayerConnectionRepository<SignInHub> playerConnections,
            ISignInService signInService
        ) : base(hubContext, playerConnections) 
        { 
            _signInService = signInService;
        }

    }
}