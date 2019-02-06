using System;

namespace Ballast.Core.Domain.Models 
{
    public class Player
    {
        
        public Guid Id { get; set; }
        public string Name { get; set; }
        
        public Player(Guid id, string name)
        {
            Id = id;
            Name = name;
        }

    }
}