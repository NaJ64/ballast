using System;
using System.Threading.Tasks;
using Ballast.Core.Messaging;

namespace Ballast.Core.Application.Services
{
    public class DomainApplicationEventEmitter : IApplicationEventEmitter
    {

        private readonly IEventBus _eventBus;
        private bool _isEnabled;

        public DomainApplicationEventEmitter(IEventBus eventBus)
        {
            _eventBus = eventBus;
            _isEnabled = false;
        }

        public void Dispose() 
        {
            _isEnabled = false; 
        }

        public bool IsEnabled => _isEnabled;

        public Task StartAsync()
        {
            _isEnabled = true;
            throw new System.NotImplementedException();
        }

        public Task StopAsync()
        {
            _isEnabled = false;
            throw new System.NotImplementedException();
        }

    }
}