using Ballast.Core.Messaging;
using Ballast.Core.Services;
using Ballast.Core.ValueObjects;
using Ballast.Web.Services;
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
        private readonly IPlayerConnectionRepository _playerConnections;

        public SignInHub(IEventBus eventBus, ISignInService signInService, IPlayerConnectionRepository playerConnections) : base(eventBus)
        {
            _signInService = signInService;
            _playerConnections = playerConnections;
        }

        public async override Task OnConnectedAsync()
        {
            await base.OnConnectedAsync();
            var connectionId = Context.ConnectionId;
            _playerConnections.Add(connectionId);
        }

        public async Task SignInAsync(Guid invocationId, PlayerSignInRequest request)
        {
            try
            {
                var connectionId = Context.ConnectionId;
                _playerConnections.SetPlayerId(connectionId, null);
                var signedInPlayer = await _signInService.SignInAsync(request);
                _playerConnections.SetPlayerId(connectionId, signedInPlayer?.Id);
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
                _playerConnections.Remove(connectionId);
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
                    var connectionIds = _playerConnections.GetAll(playerId);
                    foreach(var connectionId in connectionIds)
                    {
                        _playerConnections.SetPlayerId(connectionId, null);
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
            var playerId = _playerConnections.GetPlayerId(connectionId).GetValueOrDefault();
            if (!playerId.Equals(Guid.Empty))
            {
                await _signInService.SignOutAsync(new PlayerSignOutRequest() {
                    PlayerId = playerId.ToString(),
                    TimestampText = DateTime.UtcNow.ToString()
                });
            }
            _playerConnections.Remove(connectionId);
            await base.OnDisconnectedAsync(exception);
        }

    }
}