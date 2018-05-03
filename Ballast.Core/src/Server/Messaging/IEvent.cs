
using System;

namespace Ballast.Core.Messaging
{
    public interface IEvent 
    {
        
        Guid Id { get; }

    }
}