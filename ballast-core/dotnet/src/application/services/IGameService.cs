using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Ballast.Core.Application.Models;

namespace Ballast.Core.Application.Services
{
    public interface IGameService : IDisposable
    {
        Task<Guid> GetTestGameIdAsync();
        Task<IEnumerable<GameDto>> GetAllGamesAsync();
        Task<GameDto> GetGameAsync(Guid gameId);
        Task<GameDto> CreateGameAsync(CreateGameOptions options);
        Task<GameDto> StartGameAsync(Guid gameId);
        Task<GameDto> EndGameAsync(Guid gameId);
        Task DeleteGameAsync(Guid gameId);
        Task<GameDto> AddPlayerToGameAsync(AddPlayerOptions options);
        Task<GameDto> RemovePlayerFromGameAsync(RemovePlayerOptions options);
        Task<VesselDto> AddPlayerToVesselAsync(AddPlayerOptions options);
        Task<VesselDto> RemovePlayerFromVesselAsync(RemovePlayerOptions options);
        Task<VesselDto> AddPlayerToVesselRoleAsync(AddPlayerOptions options);
        Task<VesselDto> RemovePlayerFromVesselRoleAsync(RemovePlayerOptions options);
        Task<VesselDto> MoveVesselAsync(VesselMoveRequest request);
    }
}