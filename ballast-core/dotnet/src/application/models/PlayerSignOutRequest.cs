using System;

namespace Ballast.Core.Application.Models
{
    public class PlayerSignOutRequest 
    {
        public Guid PlayerId { get; set; }
        public string SentOnDateIsoString { get; set; }
    }
}