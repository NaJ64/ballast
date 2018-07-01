using Ballast.Core.Messaging;
using Ballast.Web.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace Ballast.Web.HubMethods
{
    public class SignInHubMethods : ServiceHubMethodsBase<SignInHub>
    {

        public SignInHubMethods(IHubContext<SignInHub> hubContext) : base(hubContext) { }

    }
}