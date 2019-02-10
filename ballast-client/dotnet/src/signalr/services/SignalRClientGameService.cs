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
            CreateInvocationAsync<GameDto>("addPlayerToGameAsync", options);

        public Task<VesselDto> AddPlayerToVesselAsync(AddPlayerOptions options) =>
            CreateInvocationAsync<VesselDto>("addPlayerToVesselAsync", options);

        public Task<VesselDto> AddPlayerToVesselRoleAsync(AddPlayerOptions options) =>
            CreateInvocationAsync<VesselDto>("addPlayerToVesselRoleAsync", options);

        public Task<GameDto> CreateGameAsync(CreateGameOptions options) =>
            CreateInvocationAsync<GameDto>("createGameAsync", options);

        public Task DeleteGameAsync(Guid gameId) =>
            CreateInvocationAsync("deleteGameAsync", gameId);

        public Task<GameDto> EndGameAsync(Guid gameId) =>
            CreateInvocationAsync<GameDto>("endGameAsync", gameId);

        public Task<IEnumerable<GameDto>> GetAllGamesAsync() =>
            CreateInvocationAsync<IEnumerable<GameDto>>("getAllGamesAsync");

        public Task<GameDto> GetGameAsync(Guid gameId) =>
            CreateInvocationAsync<GameDto>("getGameAsync", gameId);

        public Task<Guid> GetTestGameIdAsync() =>
            CreateInvocationAsync<Guid>("getTestGameIdAsync");

        public Task<VesselDto> MoveVesselAsync(VesselMoveRequest request) =>
            CreateInvocationAsync<VesselDto>("moveVesselAsync", request);

        public Task<GameDto> RemovePlayerFromGameAsync(RemovePlayerOptions options) =>
            CreateInvocationAsync<GameDto>("removePlayerFromGameAsync", options);

        public Task<VesselDto> RemovePlayerFromVesselAsync(RemovePlayerOptions options) =>
            CreateInvocationAsync<VesselDto>("removePlayerFromVesselAsync", options);

        public Task<VesselDto> RemovePlayerFromVesselRoleAsync(RemovePlayerOptions options) =>
            CreateInvocationAsync<VesselDto>("removePlayerFromVesselRoleAsync", options);

        public Task<GameDto> StartGameAsync(Guid gameId) =>
            CreateInvocationAsync<GameDto>("startGameAsync", gameId);
        
    }
}


        
