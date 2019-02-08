using Ballast.Core.Application.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Ballast.Core.Application.Services
{
    public interface IGameService : IDisposable
    {
        Task<string> GetTestGameIdAsync();
        Task<IEnumerable<GameDto>> GetAllGamesAsync();
        Task<GameDto> GetGameAsync(string gameId);
        Task<GameDto> CreateGameAsync(CreateGameOptions options);
        Task<GameDto> StartGameAsync(string gameId);
        Task<GameDto> EndGameAsync(string gameId);
        Task DeleteGameAsync(string gameId);
        Task<GameDto> AddPlayerToGameAsync(AddPlayerOptions options);
        Task<GameDto> RemovePlayerFromGameAsync(RemovePlayerOptions options);
        Task<VesselDto> AddPlayerToVesselAsync(AddPlayerOptions options);
        Task<VesselDto> RemovePlayerFromVesselAsync(RemovePlayerOptions options);
        Task<VesselDto> AddPlayerToVesselRoleAsync(AddPlayerOptions options);
        Task<VesselDto> RemovePlayerFromVesselRoleAsync(RemovePlayerOptions options);
        Task<VesselDto> MoveVesselAsync(VesselMoveRequest request);
    }
}