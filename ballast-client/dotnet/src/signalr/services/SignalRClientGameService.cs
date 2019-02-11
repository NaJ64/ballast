using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Ballast.Core.Application.Models;
using Ballast.Core.Application.Services;

namespace Ballast.Client.SignalR.Services
{
    public class SignalRClientGameService : SignalRClientServiceBase, IGameService
    {

        public SignalRClientGameService(ISignalRClientOptions options) : base(options) { }

        protected override string HubName => "gamehub";

        public Task<GameDto> AddPlayerToGameAsync(AddPlayerOptions options) =>
            CreateInvocationAsync<GameDto>("AddPlayerToGameAsync", options);

        public Task<VesselDto> AddPlayerToVesselAsync(AddPlayerOptions options) =>
            CreateInvocationAsync<VesselDto>("AddPlayerToVesselAsync", options);

        public Task<VesselDto> AddPlayerToVesselRoleAsync(AddPlayerOptions options) =>
            CreateInvocationAsync<VesselDto>("AddPlayerToVesselRoleAsync", options);

        public Task<GameDto> CreateGameAsync(CreateGameOptions options) =>
            CreateInvocationAsync<GameDto>("CreateGameAsync", options);

        public Task DeleteGameAsync(Guid gameId) =>
            CreateInvocationAsync("DeleteGameAsync", gameId);

        public Task<GameDto> EndGameAsync(Guid gameId) =>
            CreateInvocationAsync<GameDto>("EndGameAsync", gameId);

        public Task<IEnumerable<GameDto>> GetAllGamesAsync() =>
            CreateInvocationAsync<IEnumerable<GameDto>>("GetAllGamesAsync");

        public Task<GameDto> GetGameAsync(Guid gameId) =>
            CreateInvocationAsync<GameDto>("GetGameAsync", gameId);

        public Task<Guid> GetTestGameIdAsync() =>
            CreateInvocationAsync<Guid>("GetTestGameIdAsync");

        public Task<VesselDto> MoveVesselAsync(VesselMoveRequest request) =>
            CreateInvocationAsync<VesselDto>("MoveVesselAsync", request);

        public Task<GameDto> RemovePlayerFromGameAsync(RemovePlayerOptions options) =>
            CreateInvocationAsync<GameDto>("RemovePlayerFromGameAsync", options);

        public Task<VesselDto> RemovePlayerFromVesselAsync(RemovePlayerOptions options) =>
            CreateInvocationAsync<VesselDto>("RemovePlayerFromVesselAsync", options);

        public Task<VesselDto> RemovePlayerFromVesselRoleAsync(RemovePlayerOptions options) =>
            CreateInvocationAsync<VesselDto>("RemovePlayerFromVesselRoleAsync", options);

        public Task<GameDto> StartGameAsync(Guid gameId) =>
            CreateInvocationAsync<GameDto>("StartGameAsync", gameId);
        
    }
}


        
