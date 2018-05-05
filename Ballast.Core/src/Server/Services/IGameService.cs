using Ballast.Core.Models;
using Ballast.Core.Models.Interfaces;
using Ballast.Core.ValueObjects;
using Ballast.Core.ValueObjects.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Ballast.Core.Services
{
    public interface IGameService
    {
        Task MoveVesselAsync(IVesselMoveRequest request);
    }
}