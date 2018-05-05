using Ballast.Core.Messaging;
using Ballast.Core.Models;
using Ballast.Core.Models.Interfaces;
using Ballast.Core.ValueObjects;
using Ballast.Core.ValueObjects.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Ballast.Core.Services
{
    public class GameService : IGameService
    {

        private readonly IEventBus _eventBus;
        private readonly IDictionary<Guid, Game> _games;

        public GameService(IEventBus eventBus)
        {
            _eventBus = eventBus;
            _games = new Dictionary<Guid, Game>();
        }

        public Task MoveVesselAsync(IVesselMoveRequest request)
        {
            throw new NotImplementedException();
        }
        
    }
}