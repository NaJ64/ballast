using System;

namespace Ballast.Core.ValueObjects
{
    public class CreateGameOptions
    {
        public CreateVesselOptions[] VesselOptions { get; set; }
        public int? BoardSize { get; set; }
        public int? BoardShapeValue { get; set; }
    }
}