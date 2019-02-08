using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Ballast.Core.Application.Models;
using Ballast.Core.Application.Services;

namespace Ballast.Client.SignalR
{
    public class SignalRClientGameService : IGameService
    {
        
        public void Dispose()
        {
            throw new NotImplementedException();
        }

        public Task<GameDto> AddPlayerToGameAsync(AddPlayerOptions options)
        {
            throw new NotImplementedException();
        }

        public Task<VesselDto> AddPlayerToVesselAsync(AddPlayerOptions options)
        {
            throw new NotImplementedException();
        }

        public Task<VesselDto> AddPlayerToVesselRoleAsync(AddPlayerOptions options)
        {
            throw new NotImplementedException();
        }

        public Task<GameDto> CreateGameAsync(CreateGameOptions options)
        {
            throw new NotImplementedException();
        }

        public Task DeleteGameAsync(Guid gameId)
        {
            throw new NotImplementedException();
        }

        public Task<GameDto> EndGameAsync(Guid gameId)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<GameDto>> GetAllGamesAsync()
        {
            throw new NotImplementedException();
        }

        public Task<GameDto> GetGameAsync(Guid gameId)
        {
            throw new NotImplementedException();
        }

        public Task<Guid> GetTestGameIdAsync()
        {
            throw new NotImplementedException();
        }

        public Task<VesselDto> MoveVesselAsync(VesselMoveRequest request)
        {
            throw new NotImplementedException();
        }

        public Task<GameDto> RemovePlayerFromGameAsync(RemovePlayerOptions options)
        {
            throw new NotImplementedException();
        }

        public Task<VesselDto> RemovePlayerFromVesselAsync(RemovePlayerOptions options)
        {
            throw new NotImplementedException();
        }

        public Task<VesselDto> RemovePlayerFromVesselRoleAsync(RemovePlayerOptions options)
        {
            throw new NotImplementedException();
        }

        public Task<GameDto> StartGameAsync(Guid gameId)
        {
            throw new NotImplementedException();
        }
    }
}