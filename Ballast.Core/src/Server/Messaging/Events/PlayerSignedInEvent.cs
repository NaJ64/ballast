using Ballast.Core.Models;
using System;

namespace Ballast.Core.Messaging.Events
{

    public class PlayerSignedInEventState : EventStateBase
    {
        public Player Player { get; set; }
    }

    public class PlayerSignedInEvent : EventBase 
    {

        public override string Id => nameof(PlayerSignedInEvent);

        public Player Player { get; private set; } 

        private PlayerSignedInEvent(Player player, string isoDateTime = null) : base(isoDateTime) {
            Player = player;
        }

        public static implicit operator PlayerSignedInEvent(PlayerSignedInEventState state) =>
            new PlayerSignedInEvent(state.Player, state.IsoDateTime);

        public static PlayerSignedInEvent FromPlayer(Player player) =>
            new PlayerSignedInEvent(player);

            
    }

}