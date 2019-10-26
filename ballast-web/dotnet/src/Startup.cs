using Ballast.Server;
using Ballast.Server.DependencyInjection;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.StaticFiles;
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
                options.DefaultBoardSize = 5; // Must be an odd number for "Regular Polygon"; Must be greater than 3
                options.DefaultBoardType = "RegularPolygon"; // "Rectangle", "RegularPolygon"
                options.DefaultTileShape = "Octagon"; // "Hexagon", "Circle", "Square", "Octagon"
                options.DefaultLandToWaterRatio = 0.25;
            });
        }

        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            // Set up custom content type for GLTF (GLB) files
            var contentTypeProvider = new FileExtensionContentTypeProvider();
            contentTypeProvider.Mappings[".gltf"] = "model/gltf+json";
            // Configure request pipeline
            if (env.IsDevelopment())
                app.UseDeveloperExceptionPage();
            else
                app.UseHsts();
            app.UseHttpsRedirection();
            app.UseBallastServer();
            app.UseDefaultFiles();
            app.UseStaticFiles(new StaticFileOptions { ContentTypeProvider = contentTypeProvider });
        }
    }
}
