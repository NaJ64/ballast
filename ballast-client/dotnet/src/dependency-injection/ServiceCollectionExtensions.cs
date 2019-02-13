using System;
using Ballast.Client.SignalR;
using Ballast.Client.SignalR.Services;
using Ballast.Core.Application.Services;
using Ballast.Core.DependencyInjection;
using Microsoft.Extensions.DependencyInjection;

namespace Ballast.Client.DependencyInjection
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddBallastClient(
            this IServiceCollection services, 
            Action<IBallastClientOptions> configureOptions = null
        )
        {
            // Create new options instance
            var ballastClientOptions = new BallastClientOptions();
            configureOptions?.Invoke(ballastClientOptions);

            // Register client options
            services.AddSingleton<IBallastClientOptions>(ballastClientOptions);

            // Configure as client
            services.AddBallastCore(options => {
                options.UseDomain = false;
                options.UseLocalEventBus = true;
            });

            // SignalR Client service implementations
            if (ballastClientOptions.UseSignalR)
            {
                if (string.IsNullOrEmpty(ballastClientOptions.ServerUrl))
                    throw new ArgumentNullException(nameof(ballastClientOptions.ServerUrl));
                if (string.IsNullOrEmpty(ballastClientOptions.ServerUrl))
                    throw new ArgumentNullException(nameof(ballastClientOptions.ServerUrl));
                services.AddSingleton<ISignalRClientOptions>(new SignalRClientOptions(
                    ballastClientOptions.ServerUrl, 
                    ballastClientOptions.ClientId.GetValueOrDefault()
                ));
                services.AddSingleton<IApplicationEventEmitter, SignalRClientApplicationEventEmitter>();
                services.AddSingleton<IChatService, SignalRClientChatService>();
                services.AddSingleton<IGameService, SignalRClientGameService>();
                services.AddSingleton<ISignInService, SignalRClientSignInService>();
                services.AddSingleton<IClientBootstrapper, SignalRClientBootstrapper>();
            }

            return services;
        }
    }
}