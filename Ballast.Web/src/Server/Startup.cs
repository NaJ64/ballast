using Ballast.Server.Hubs;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Rewrite;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Ballast.Server
{
    public class Startup
    {

        public IConfiguration Configuration { get; }

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
        public void ConfigureServices(IServiceCollection services)
        {
            
            // var corsOrigins = Configuration.GetSection("hosting:cors:origins")
            //     .GetChildren()
            //     .Select(x => x.Value)
            //     .ToArray();

            // services.AddCors(options => options.AddPolicy("ClientWeb", builder => builder
            //     .WithOrigins(corsOrigins)
            //     .AllowAnyHeader()
            //     .AllowAnyMethod()
            //     .AllowCredentials()
            // ));

            services.AddSignalR();
            
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            //app.UseCors("ClientWeb");
            
            // // Redirect all http requests to https
            // app.UseRewriter(new RewriteOptions()
            //     .AddRedirectToHttps());

            app.UseSignalR(routes => 
            {
                routes.MapHub<ChatHub>("/chathub");
            });

            app.UseDefaultFiles();
            app.UseStaticFiles();

        }
    }
}
