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
        public string StartedOnDateIsoString { get; set; }
        public string EndedOnDateIsoString { get; set; }
    }
}