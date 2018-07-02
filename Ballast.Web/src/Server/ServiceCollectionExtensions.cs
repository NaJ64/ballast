using Ballast.Core;
using Ballast.Web.Hubs;
using Ballast.Web.HubMethods;
using Ballast.Web.Services;
using Microsoft.Extensions.DependencyInjection;
using System;

namespace Ballast.Web 
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddBallast(this IServiceCollection services)
        {
            services.AddBallastCore();

            services.AddSingleton<ChatHubMethods>();
            services.AddSingleton<SignInHubMethods>();
            services.AddSingleton<GameHubMethods>();

            services.AddSingleton<IPlayerConnectionRepository<ChatHub>, PlayerConnectionRepository<ChatHub>>();
            services.AddSingleton<IPlayerConnectionRepository<GameHub>, PlayerConnectionRepository<GameHub>>();
            services.AddSingleton<IPlayerConnectionRepository<SignInHub>, PlayerConnectionRepository<SignInHub>>();

            services.AddSingleton<ServiceHubEventDispatcher>(serviceProvider => 
                ServiceHubEventDispatcher.GetInstance(serviceProvider));
                
            return services;
        }
    }
}