using System;

namespace Ballast.Core.Application.Models
{
    public class RemovePlayerOptions
    {
        public Guid PlayerId { get; set; }
        public Guid GameId { get; set; }
        public Guid VesselId { get; set; }
        public string[] VesselRoles { get; set; }
    }
}