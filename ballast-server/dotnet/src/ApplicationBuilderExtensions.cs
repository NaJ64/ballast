using Microsoft.AspNetCore.Builder;
using Ballast.Server.SignalR.Hubs;
using Ballast.Server.DependencyInjection;

namespace Ballast.Server
{
    public static class ApplicationBuilderExtensions
    {
        public static IApplicationBuilder UseBallastServer(this IApplicationBuilder app)
        {
            var serviceProvider = app.ApplicationServices;
            var ballastServerOptions = (IBallastServerOptions)serviceProvider.GetService(typeof(IBallastServerOptions));
            if (ballastServerOptions?.UseSignalR ?? false)
            {
                app.UseSignalR(routes => 
                {
                    routes.MapHub<EventHub>("/eventhub");
                    routes.MapHub<ChatHub>("/chathub");
                    routes.MapHub<GameHub>("/gamehub");
                    routes.MapHub<SignInHub>("/signinhub");
                });
            }
            return app;
        }
    }
}