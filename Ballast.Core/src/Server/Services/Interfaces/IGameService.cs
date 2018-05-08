using Ballast.Core.Models;
using Ballast.Core.ValueObjects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Ballast.Core.Services
{
    public interface IGameService : IDisposable
    {
        Task MoveVesselAsync(IVesselMoveRequest request);
        Task<IEnumerable<IGame>> GetAllGamesAsync();
        Task RemoveGameAsync(Guid gameId);
        Task<IGame> CreateNewGameAsync(ICreateVesselOptions vesselOptions, int? boardSize = null, ITileShape boardShape = null);
        Task<IGame> CreateNewGameAsync(IEnumerable<ICreateVesselOptions> vesselOptions, int? boardSize = null, ITileShape boardShape = null);
    }
}