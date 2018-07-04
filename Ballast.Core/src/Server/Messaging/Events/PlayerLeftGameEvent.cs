using Ballast.Core.Models;
using System;
using System.Linq;

namespace Ballast.Core.Messaging.Events
{
    public class PlayerLeftGameEvent : EventBase 
    {

        public override string Id => nameof(PlayerLeftGameEvent);

        private readonly Player _player;

        public IGame Game { get; private set; }

        public IPlayer Player => _player;

        public PlayerLeftGameEvent(Models.Game game, Player player) : base() 
        {
            Game = game;
            _player = player;
        }

    }

}