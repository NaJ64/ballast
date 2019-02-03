using System;

namespace Ballast.Core.Application.Models
{
    public class GameDto
    {
        public Guid Id { get; set; }
        public BoardDto Board { get; set; }
        public VesselDto[] Vessels { get; set; }
        public PlayerDto[] Players { get; set; }
        public DateTime CreatedUtc { get; set; }
        public DateTime? StartedUtc { get; set; }
        public DateTime? EndedUtc { get; set; }
    }
}