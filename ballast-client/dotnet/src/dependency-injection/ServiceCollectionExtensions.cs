using System;
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
            
            // Configure as client
            services.AddBallastCore(options => {
                options.UseDomain = false;
                options.UseLocalEventBus = true;
            });

            return services;
        }
    }
}