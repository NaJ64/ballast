using System;

namespace Ballast.Core.Application.Models
{
    public class GameDto
    {
        public Guid Id { get; set; }
        public BoardDto Board { get; set; }
        public VesselDto[] Vessels { get; set; }
        public PlayerDto[] Players { get; set; }
        public string CreatedOnDateIsoString { get; set; }
        public DateTime? StartedOnDateIsoString { get; set; }
        public DateTime? EndedOnDateIsoString { get; set; }
    }
}