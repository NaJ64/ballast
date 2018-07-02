using System;

namespace Ballast.Core.Messaging
{
    public abstract class EventBase : IEvent 
    { 

        public abstract string Id { get; }

        public virtual string IsoDateTime { get; set; }

        public EventBase(string isoDateTime = null) 
        {
            IsoDateTime = isoDateTime ?? DateTime.UtcNow.ToString("s", System.Globalization.CultureInfo.InvariantCulture);
        }
        
    }
}