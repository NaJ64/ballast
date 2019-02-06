using System;

namespace Ballast.Core.Application.Models
{
    public class VesselDto
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public int[] OrderedTriple { get; set; }
        public string CaptainId { get; set; }
        public string CaptainName { get; set; }
        public string RadiomanId { get; set; }
        public string RadiomanName { get; set; }
    }
}