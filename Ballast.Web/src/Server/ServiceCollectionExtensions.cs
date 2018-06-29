using Ballast.Core;
using Ballast.Web.Hubs;
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
            services.AddSingleton<IPlayerConnectionRepository<SignInHub>, SignInPlayerConnectionRepository>();
            services.AddSingleton<IPlayerConnectionRepository<GameHub>, GamePlayerConnectionRepository>();
            return services;
        }
    }
}