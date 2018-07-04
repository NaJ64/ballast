using System;

namespace Ballast.Core.Messaging
{

    public abstract class EventStateBase : IEvent
    {
        public string Id { get; set; }

        public string IsoDateTime { get; set; }
    }

    public abstract class EventBase : IEvent 
    { 

        public abstract string Id { get; }

        public virtual string IsoDateTime { get; protected set; }

        public EventBase(string isoDateTime = null) 
        {
            IsoDateTime = isoDateTime ?? DateTime.UtcNow.ToString("s", System.Globalization.CultureInfo.InvariantCulture);
        }
        
    }
}