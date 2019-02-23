using Microsoft.AspNetCore.Builder;
using Ballast.Server.SignalR.Hubs;
using Ballast.Server.DependencyInjection;
using Ballast.Core.Application.Services;
using Ballast.Server.SignalR.HubMethods;

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
            // Start listening for domain events to emit application events
            var applicationEventEmitter = (IApplicationEventEmitter)serviceProvider.GetService(typeof(IApplicationEventEmitter));
            applicationEventEmitter.Start();
            // Resolve EventHubMethods to subscribe to application events
            var eventHubMethods = (EventHubMethods)serviceProvider.GetService(typeof(EventHubMethods));
            return app;
        }

    }
}