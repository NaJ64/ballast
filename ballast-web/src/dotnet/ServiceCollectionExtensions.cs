using Ballast.Core.DependencyInjection;
using Ballast.Web.Hubs;
using Ballast.Web.HubMethods;
using Ballast.Web.Services;
using Microsoft.Extensions.DependencyInjection;

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

            services.AddSingleton<IPlayerConnectionRepository<ChatHub>, LocalPlayerConnectionRepository<ChatHub>>();
            services.AddSingleton<IPlayerConnectionRepository<GameHub>, LocalPlayerConnectionRepository<GameHub>>();
            services.AddSingleton<IPlayerConnectionRepository<SignInHub>, LocalPlayerConnectionRepository<SignInHub>>();

            services.AddSingleton<ServiceHubEventDispatcher>(serviceProvider => 
                ServiceHubEventDispatcher.GetInstance(serviceProvider));
                
            return services;
        }
    }
}