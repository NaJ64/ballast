using Ballast.Core.Models.Interfaces;
using System;
using System.Collections.Generic;

namespace Ballast.Core.Models
{
    public class Game : IGame
    {
        public Guid Id { get; private set; }
        public IBoard Board { get; private set; }
        public IEnumerable<IVessel> Vessels { get; private set; }
    }
}