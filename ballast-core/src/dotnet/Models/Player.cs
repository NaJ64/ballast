using System;

namespace Ballast.Core.Models 
{

    public class PlayerState
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
    }

    public class Player
    {
        
        public Guid Id { get; set; }
        public string Name { get; set; }
        
        private Player(Guid id, string name)
        {
            Id = id;
            Name = name;
        }

        public static Player FromProperties(Guid id, string name) => 
            new Player(
                id: id,
                name: name
            );

        public static implicit operator Player(PlayerState state) =>
            new Player(state.Id, state.Name);

    }

}