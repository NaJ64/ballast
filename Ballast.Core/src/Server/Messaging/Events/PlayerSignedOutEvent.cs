using Ballast.Core.Models;
using System;

namespace Ballast.Core.Messaging.Events
{

    public class PlayerSignedOutEventState : EventStateBase
    {
        public Player Player { get; set; }
    }

    public class PlayerSignedOutEvent : EventBase 
    {

        public override string Id => nameof(PlayerSignedOutEvent);

        public Player Player { get; private set; } 

        private PlayerSignedOutEvent(Player player = null, string isoDateTime = null) : base(isoDateTime) {
            Player = player;
        }

        public static implicit operator PlayerSignedOutEvent(PlayerSignedOutEventState state) =>
            new PlayerSignedOutEvent(state.Player, state.IsoDateTime);

        public static PlayerSignedOutEvent FromPlayer(Player player = null) =>
            new PlayerSignedOutEvent(player);

            
    }

}