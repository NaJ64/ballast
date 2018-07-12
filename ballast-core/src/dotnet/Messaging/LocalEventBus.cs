using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Ballast.Core.Messaging
{
    public class LocalEventBus : IEventBus , IDisposable
    {

        private readonly IDictionary<string, IList<Delegate>> _subscriptions;

        public LocalEventBus() 
        {
            _subscriptions = new Dictionary<string, IList<Delegate>>();
        }

        public void Dispose()
        {
            foreach(var subscriptionList in _subscriptions) 
            {
                subscriptionList.Value.Clear();
            }
            _subscriptions.Clear();
        }

        public IEnumerable<Func<TEvent, Task>> GetHandlers<TEvent>(string key) where TEvent : EventBase
        {
            // get subscription list
            var subscriptions = GetSubscriptions<TEvent>(key);
            // return projection to list of handler functions
            return subscriptions.Select(x => x.asyncHandler);
        }

        public async Task PublishAsync<TEvent>(TEvent evt) where TEvent : EventBase
        {
            // Get all subscribers for the current event key
            var subscriptions = GetSubscriptions<TEvent>(evt.Id);
            // Loop through the subscribers
            foreach (var subscription in subscriptions) 
            {
                // invoke the handler(s)
                await subscription.asyncHandler(evt);
            }
        }

        public void Subscribe<TEvent>(string key, Func<TEvent, Task> asyncHandler) where TEvent : EventBase
        {
            // Get all subscribers for the current event key
            var subscriptions = GetSubscriptions<TEvent>(key);
            // Add a new handler
            _subscriptions[key].Add(asyncHandler);
            //subscriptions.Add((key: key, asyncHandler: asyncHandler));
        }

        public void Unsubscribe<TEvent>(string key, Func<TEvent, Task> asyncHandler) where TEvent : EventBase
        {
            // Get all subscribers for the current event key
            var subscriptions = GetSubscriptions<TEvent>(key);
            // Find an item to remove where subscription.handler has reference equality
            var remove = subscriptions.FirstOrDefault(x => x.asyncHandler == asyncHandler);
            // If the handler index was obtained
            if (!remove.Equals(default((string, Func<TEvent, Task>))))
                // remove the subscription from the collection
                _subscriptions[key].Remove(remove.asyncHandler);
                //subscriptions.Remove(remove);
        }
            
        private IEnumerable<(string key, Func<TEvent, Task> asyncHandler)> GetSubscriptions<TEvent>(string key) where TEvent: EventBase
        {
            // check if the current event signature/key already exists
            if (!_subscriptions.ContainsKey(key))
                _subscriptions.Add(key, new List<Delegate>()); // set to new collection
            // get the subscription list
            var subscriptionList = _subscriptions[key]
                .Select(asyncHandler => {
                    // Deconstruct asyncHandler
                    Func<TEvent, Task> handler = (evt) => ((Func<TEvent, Task>)asyncHandler).Invoke((TEvent)evt);
                    return (key, handler);
                })
                .ToList();
            // Return the subscriptions
            return (IList<(string, Func<TEvent, Task>)>)subscriptionList;
        }

    }
}