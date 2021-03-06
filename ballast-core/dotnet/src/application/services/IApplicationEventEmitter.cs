using System;
using System.Threading.Tasks;

namespace Ballast.Core.Application.Services
{
    public interface IApplicationEventEmitter : IDisposable
    { 
        bool IsEnabled { get; }
        void Start();
        void Stop();
    }
}