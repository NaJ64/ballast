using System;
using Ballast.Core.Utilities;

namespace Ballast.Core.Messaging
{
    public abstract class EventBase : IEvent 
    { 

        public abstract string Id { get; }

        public virtual string EventDateIsoString { get; protected set; }

        public EventBase(string eventDateIsoString = null) 
        {
            EventDateIsoString = eventDateIsoString ?? EventBase.GetDateIsoString();
        }

        public static string GetDateIsoString() => 
            DateTime.UtcNow.ToIsoString();
        
    }
}