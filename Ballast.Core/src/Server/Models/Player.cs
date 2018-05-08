using System;

namespace Ballast.Core.Models 
{
    public class Player : IPlayer
    {
        
        public Guid Id { get; private set; }
        public string Name { get; private set; }

        private Player(Guid id, string name)
        {
            Id = id;
            Name = name;
        }

        private Player(IPlayer state) : this(
            id: state.Id,
            name: state.Name
        ) {}

        public static Player FromProperties(Guid id, string name) => new Player(
            id: id,
            name: name
        );

        public static Player FromObject(IPlayer state) => new Player(state);

    }
}