using Ballast.Core.Models;
using Ballast.Core.ValueObjects;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Threading.Tasks;

namespace Ballast.Server.Hubs 
{
    public class GameHub : Hub
    {
        public Task RequestVesselMove(VesselMoveRequest vesselMoveRequest)
        {
            var gameId = Guid.NewGuid();
            //var board = new Board(BoardType.RegularPolygon.Value, gameId,,);
            var gameState = new Game(gameId, null, new Vessel[] { }) 
            {

            };
            return Clients.All.SendAsync("receiveGameStateUpdate", gameState);
        }
    }
}