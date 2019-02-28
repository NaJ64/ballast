using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Ballast.Server;
using Ballast.Server.DependencyInjection;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;

namespace Ballast.Web
{
    public class Startup
    {
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddBallastServer(options => 
            {
                options.UseSignalR = true;
                options.DefaultBoardSize = 7; // Must be an odd number for "Regular Polygon"; Must be greater than 3
                options.DefaultBoardType = "RegularPolygon"; // "Rectangle", "RegularPolygon"
                options.DefaultTileShape = "Hexagon"; // "Hexagon", "Circle", "Square", "Octagon"
                options.DefaultLandToWaterRatio = 0.33;
            });
        }

        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
                app.UseDeveloperExceptionPage();
            else
                app.UseHsts();
            app.UseHttpsRedirection();
            app.UseBallastServer();
            app.UseDefaultFiles();
            app.UseStaticFiles();
        }
    }
}
