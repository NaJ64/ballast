using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Ballast.Core.Messaging
{
    public interface IEventBus
    {
        IEnumerable<Func<TEvent, Task>> GetHandlers<TEvent>(string type) where TEvent : IEvent;
        Task PublishAsync<TEvent>(TEvent evt) where TEvent : IEvent;
        void Subscribe<TEvent>(string type, Func<TEvent, Task> asyncEventHandler) where TEvent : IEvent;
        void Unsubscribe<TEvent>(string type, Func<TEvent, Task> asyncEventHandler) where TEvent : IEvent;
    }
}