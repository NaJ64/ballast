using System;

namespace Ballast.Core.Models 
{
    public interface IPlayer 
    {
        Guid Id { get; }
        string Name { get; }
    }
}