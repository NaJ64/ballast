using System;

namespace Ballast.Core.Application.Models
{
    public class VesselDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public int[] OrderedTriple { get; set; }
        public Guid CaptainId { get; set; }
        public string CaptainName { get; set; }
        public Guid RadiomanId { get; set; }
        public string RadiomanName { get; set; }
    }
}