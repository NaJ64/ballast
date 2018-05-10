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

        Task<IEnumerable<IGame>> GetAllGamesAsync();
        Task<IGame> GetGameAsync(Guid gameId);

        Task<IGame> CreateGameAsync(CreateGameOptions options);
        Task<IGame> StartGameAsync(Guid gameId);
        Task<IGame> EndGameAsync(Guid gameId);
        Task DeleteGameAsync(Guid gameId);

        Task<IGame> AddPlayerToGameAsync(AddPlayerOptions options);
        Task<IGame> RemovePlayerFromGameAsync(RemovePlayerOptions options);

        Task<IVessel> AddPlayerToVesselAsync(AddPlayerOptions options);
        Task<IVessel> RemovePlayerFromVesselAsync(RemovePlayerOptions options);

        Task<IVessel> AddPlayerToVesselRoleAsync(AddPlayerOptions options);
        Task<IVessel> RemovePlayerFromVesselRoleAsync(RemovePlayerOptions options);

        Task MoveVesselAsync(VesselMoveRequest request);

    }
}