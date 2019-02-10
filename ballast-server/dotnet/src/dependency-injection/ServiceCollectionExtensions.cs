using System;
using Ballast.Core.Application.Services;
using Ballast.Core.DependencyInjection;
using Ballast.Server.SignalR.HubMethods;
using Ballast.Server.SignalR.Hubs;
using Ballast.Server.SignalR.Repositories;
using Ballast.Server.SignalR.Repositories.Impl;
using Microsoft.Extensions.DependencyInjection;

namespace Ballast.Server.DependencyInjection
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddBallastServer(
            this IServiceCollection services, 
            Action<IBallastServerOptions> configureOptions = null
        )
        {
            // Create new options instance
            var ballastServerOptions = new BallastServerOptions();
            configureOptions?.Invoke(ballastServerOptions);

            // IBallastServerOptions
            services.AddSingleton<IBallastServerOptions>(ballastServerOptions);

            // Configure as server
            services.AddBallastCore(options => {
                options.UseDomain = true;
                options.UseLocalEventBus = true;
            });

            // SignalR Server service implementations
            if (ballastServerOptions.UseSignalR)
            {
                // HubMethods
                services.AddSingleton<EventHubMethods>();
                services.AddSingleton<ChatHubMethods>();
                services.AddSingleton<SignInHubMethods>();
                services.AddSingleton<GameHubMethods>();
                // IPlayerConnectionRepository
                services.AddSingleton<IPlayerConnectionRepository<EventHub>, LocalPlayerConnectionRepository<EventHub>>();
                services.AddSingleton<IPlayerConnectionRepository<ChatHub>, LocalPlayerConnectionRepository<ChatHub>>();
                services.AddSingleton<IPlayerConnectionRepository<GameHub>, LocalPlayerConnectionRepository<GameHub>>();
                services.AddSingleton<IPlayerConnectionRepository<SignInHub>, LocalPlayerConnectionRepository<SignInHub>>();
            }

            return services;
        }
    }
}