using Ballast.Core.Messaging;
using Ballast.Core.Services;
using Microsoft.Extensions.DependencyInjection;
using System;

namespace Ballast.Core 
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddBallastCore(this IServiceCollection services)
        {
            
            services.AddSingleton<IEventBus, LocalEventBus>();

            services.AddSingleton<IChatService, ChatService>();
            services.AddSingleton<Func<IChatService>>(serviceProvider => () =>
                serviceProvider.GetRequiredService<IChatService>()
            );

            services.AddSingleton<IGameService, GameService>();
            services.AddSingleton<Func<IGameService>>(serviceProvider => () =>
                serviceProvider.GetRequiredService<IGameService>()
            );

            services.AddTransient<IBoardGenerator, BoardGenerator>();

            return services;
        }
    }
}