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


        Task<Guid> GetTestGameIdAsync();

        Task<IEnumerable<Game>> GetAllGamesAsync();
        Task<Game> GetGameAsync(Guid gameId);

        Task<Game> CreateGameAsync(CreateGameOptions options);
        Task<Game> StartGameAsync(Guid gameId);
        Task<Game> EndGameAsync(Guid gameId);
        Task DeleteGameAsync(Guid gameId);

        Task<Game> AddPlayerToGameAsync(AddPlayerOptions options);
        Task<Game> RemovePlayerFromGameAsync(RemovePlayerOptions options);

        Task<Vessel> AddPlayerToVesselAsync(AddPlayerOptions options);
        Task<Vessel> RemovePlayerFromVesselAsync(RemovePlayerOptions options);

        Task<Vessel> AddPlayerToVesselRoleAsync(AddPlayerOptions options);
        Task<Vessel> RemovePlayerFromVesselRoleAsync(RemovePlayerOptions options);

        Task<Vessel> MoveVesselAsync(VesselMoveRequest request);

    }
}