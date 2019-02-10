using System;
using Ballast.Core.Application.Services;
using Ballast.Core.Application.Services.Impl;
using Ballast.Core.Domain.Services;
using Ballast.Core.Messaging;
using Ballast.Core.Messaging.Impl;
using Microsoft.Extensions.DependencyInjection;

namespace Ballast.Core.DependencyInjection
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddBallastCore(
            this IServiceCollection services, 
            Action<IBallastCoreOptions> configureOptions = null
        )
        {
            // Create new options instance
            var ballastCoreOptions = new BallastCoreOptions();
            configureOptions?.Invoke(ballastCoreOptions);

            // IBallastCoreOptions
            services.AddSingleton<IBallastCoreOptions>(ballastCoreOptions);
            
            // Local event bus
            if (ballastCoreOptions.UseLocalEventBus) 
            {
                services.AddSingleton<IEventBus, LocalEventBus>();
            }

            // Domain service implementations
            if (ballastCoreOptions.UseDomain) 
            {
                services.AddTransient<IBoardGenerator, BoardGenerator>();
                services.AddSingleton<IChatService, DomainChatService>();
                services.AddSingleton<IGameService, DomainGameService>();
                services.AddSingleton<ISignInService, DomainSignInService>();
            }

            return services;
        }
    }
}