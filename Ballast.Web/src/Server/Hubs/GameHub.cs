using Ballast.Core.Models;
using Ballast.Core.Services;
using Ballast.Core.ValueObjects;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Threading.Tasks;

namespace Ballast.Server.Hubs 
{
    public class GameHub : Hub
    {
        public Task MoveVesselAsync(VesselMoveRequest vesselMoveRequest)
        {
            var gameId = Guid.NewGuid();
            var boardGenerator = new BoardGenerator();
            var board = boardGenerator.CreateBoard(gameId, BoardType.RegularPolygon, TileShape.Circle, 7);
            var game = Game.FromProperties(
                id: gameId, 
                board: board,
                vessels: new Vessel[] { }
            );
            return Clients.All.SendAsync("gameStateChanged", game);
        }
    }
}