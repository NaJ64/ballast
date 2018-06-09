using Ballast.Core.Messaging;
using Ballast.Core.Services;
using Ballast.Core.ValueObjects;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Ballast.Web.Hubs 
{
    public class SignInHub : ServiceHubBase
    {

        private readonly ISignInService _signInService;
        private readonly IDictionary<string, Guid?> _playerConnections;

        public SignInHub(IEventBus eventBus, ISignInService signInService) : base(eventBus)
        {
            _signInService = signInService;
        }

        public async override Task OnConnectedAsync()
        {
            await base.OnConnectedAsync();
            var connectionId = Context.ConnectionId;
            if (_playerConnections.ContainsKey(connectionId))
                _playerConnections.Remove(connectionId);
            _playerConnections.Add(connectionId, null);
        }

        public async Task SignInAsync(Guid invocationId, PlayerSignInRequest request)
        {
            try
            {
                var connectionId = Context.ConnectionId;
                if (!_playerConnections.ContainsKey(connectionId))
                    _playerConnections.Add(connectionId, null);
                _playerConnections[connectionId] = null;
                var signedInPlayer = await _signInService.SignInAsync(request);
                _playerConnections[connectionId] = signedInPlayer?.Id;
                await ResolveValueAsync(Clients.Caller, nameof(SignInAsync), invocationId, signedInPlayer);
            }
            catch (Exception ex)
            {
                await RejectAsync(Clients.Caller, nameof(SignInAsync), invocationId, ex.Message);
            }
        }

        public async Task SignOutAsync(Guid invocationId, PlayerSignOutRequest request)
        {
            try
            {
                var connectionId = Context.ConnectionId;
                if (!_playerConnections.ContainsKey(connectionId))
                    _playerConnections.Add(connectionId, null);
                _playerConnections[connectionId] = null;
                await _signInService.SignOutAsync(request);
                await ResolveAsync(Clients.Caller, nameof(SignOutAsync), invocationId);
            }
            catch (Exception ex)
            {
                await RejectAsync(Clients.Caller, nameof(SignOutAsync), invocationId, ex.Message);
            }
        }

        public async Task GetSignedInPlayerAsync(Guid invocationId, Guid playerId)
        {
            try
            {
                var signedInPlayer = await _signInService.GetSignedInPlayerAsync(playerId);
                if (signedInPlayer == null)
                {
                    var connectionIds = _playerConnections
                        .Where(x => x.Value?.Equals(playerId) ?? false)
                        .Select(x => x.Key);
                    foreach(var connectionId in connectionIds)
                    {
                        _playerConnections[connectionId] = null;
                    }
                }
                await ResolveValueAsync(Clients.Caller, nameof(GetSignedInPlayerAsync), invocationId, signedInPlayer);
            }
            catch (Exception ex)
            {
                await RejectAsync(Clients.Caller, nameof(GetSignedInPlayerAsync), invocationId, ex.Message);
            }
        }

        public async override Task OnDisconnectedAsync(Exception exception)
        {
            var connectionId = Context.ConnectionId;
            if (_playerConnections.ContainsKey(connectionId))
            {
                var playerId = _playerConnections[connectionId].GetValueOrDefault();
                if (!playerId.Equals(Guid.Empty))
                {
                    await _signInService.SignOutAsync(new PlayerSignOutRequest() {
                        PlayerId = playerId.ToString(),
                        TimestampText = DateTime.UtcNow.ToString()
                    });
                }
                _playerConnections.Remove(connectionId);
            }
            await base.OnDisconnectedAsync(exception);
        }

    }
}