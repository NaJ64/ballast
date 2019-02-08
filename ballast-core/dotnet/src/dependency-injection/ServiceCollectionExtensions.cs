using Ballast.Core.Messaging;
using Ballast.Core.Application.Services;
using Ballast.Core.Application.Services.Impl;
using Ballast.Core.Domain.Services;
using Microsoft.Extensions.DependencyInjection;
using System;

namespace Ballast.Core.DependencyInjection
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddBallastCore(this IServiceCollection services)
        {
            
            services.AddSingleton<IEventBus, LocalEventBus>();

            services.AddSingleton<IChatService, DomainChatService>();
            services.AddSingleton<Func<IChatService>>(serviceProvider => () =>
                serviceProvider.GetRequiredService<IChatService>()
            );

            services.AddSingleton<IGameService, DomainGameService>();
            services.AddSingleton<Func<IGameService>>(serviceProvider => () =>
                serviceProvider.GetRequiredService<IGameService>()
            );

            services.AddSingleton<ISignInService, DomainSignInService>();
            services.AddSingleton<Func<ISignInService>>(serviceProvider => () =>
                serviceProvider.GetRequiredService<ISignInService>()
            );

            services.AddTransient<IBoardGenerator, BoardGenerator>();

            return services;
        }
    }
}