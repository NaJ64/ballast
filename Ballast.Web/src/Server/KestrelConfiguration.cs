using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using Microsoft.Extensions.Configuration;
using System;
using System.Net;

namespace Ballast.Web
{
    public static class KestrelConfiguration
    {

        public static Action<KestrelServerOptions> ConfigureOptions(IConfiguration configuration) => options => 
        {
            
            // Get hosting config values
            var httpEnabled = bool.Parse(configuration["Hosting:Http:Enabled"]?.Trim() ?? "false");
            var httpIpAddress = configuration["Hosting:Http:IPAddress"]?.Trim().ToLower();
            var httpPort = configuration["Hosting:Http:Port"];
            // var httpsEnabled = bool.Parse(configuration["Hosting:Https:Enabled"]?.Trim() ?? "false");
            // var httpsIpAddress = configuration["Hosting:Https:IPAddress"]?.Trim().ToLower();
            // var httpsPort = configuration["Hosting:Https:Port"];
            // var httpsCertificateFileName= configuration["Hosting:Https:Certificate:FileName"]?.Trim().ToLower();
            // var httpsCertificatePassword = configuration["Hosting:Https:Certificate:Password"].Trim();

            // An HTTP address was specified
            if (httpEnabled && (httpIpAddress?.Trim() ?? "") != "")
            {
                // Determine IP address for HTTP
                IPAddress address = null;
                if (httpIpAddress == "loopback" || httpIpAddress == "localhost")
                    address = IPAddress.Loopback;
                else
                {
                    // Isolate IP address
                    if (httpIpAddress.StartsWith("http://"))
                        httpIpAddress = httpIpAddress.Substring(6);
                    address = IPAddress.Parse(httpIpAddress);
                }
                // Add HTTP listener
                options.Listen(address, int.Parse(httpPort ?? "80"));
            }

            // // An HTTPS address was specified
            // if (httpsEnabled && (httpsIpAddress?.Trim() ?? "") != "")
            // {

            //     // Determine IP Address for HTTPS
            //     IPAddress secureAddress = null;
            //     if (httpsIpAddress == "loopback" || httpsIpAddress == "localhost")
            //         secureAddress = IPAddress.Loopback;
            //     else
            //     {
            //         // Isolate IP address
            //         if (httpsIpAddress.StartsWith("https://"))
            //             httpsIpAddress = httpsIpAddress.Substring(7);
            //         secureAddress = IPAddress.Parse(httpsIpAddress);
            //     }

            //     // Add HTTPS listener
            //     options.Listen(secureAddress, int.Parse(httpsPort ?? "443"), listenOptions => 
            //         listenOptions.UseHttps(httpsCertificateFileName, httpsCertificatePassword));

            // }

        };
    }
}