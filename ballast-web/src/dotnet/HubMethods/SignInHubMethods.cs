using Ballast.Core.Services;
using Ballast.Web.Hubs;
using Ballast.Web.Services;
using Microsoft.AspNetCore.SignalR;

namespace Ballast.Web.HubMethods
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