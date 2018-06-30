using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Ballast.Core.Messaging
{
    public interface IEventBus
    {
        IEnumerable<Func<TEvent, Task>> GetHandlers<TEvent>(string type) where TEvent : EventBase;
        Task PublishAsync<TEvent>(TEvent evt) where TEvent : EventBase;
        void Subscribe<TEvent>(string type, Func<TEvent, Task> asyncEventHandler) where TEvent : EventBase;
        void Unsubscribe<TEvent>(string type, Func<TEvent, Task> asyncEventHandler) where TEvent : EventBase;
    }
}