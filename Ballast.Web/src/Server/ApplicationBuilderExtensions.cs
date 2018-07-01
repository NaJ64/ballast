using Ballast.Web.Services;
using Microsoft.AspNetCore.Builder;

namespace Ballast.Web 
{
    public static class ApplicationBuilderExtensions
    {
        public static IApplicationBuilder StartBallast(this IApplicationBuilder app) 
        {
            // This call should instantiate the singleton dispatcher (and subscribe to events)
            var dispatcher = (ServiceHubEventDispatcher)app.ApplicationServices.GetService(typeof(ServiceHubEventDispatcher));
            // Fluent api
            return app;
        }
    }
}