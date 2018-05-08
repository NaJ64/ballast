using Ballast.Core;
using Microsoft.Extensions.DependencyInjection;
using System;

namespace Ballast.Web 
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddBallast(this IServiceCollection services)
        {
            services.AddBallastCore();
            return services;
        }
    }
}