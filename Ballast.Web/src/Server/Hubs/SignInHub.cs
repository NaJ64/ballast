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

        private readonly IPlayerConnectionRepository<SignInHub> _playerConnections;
        private readonly ISignInService _signInService;

        public SignInHub(IEventBus eventBus, IPlayerConnectionRepository<SignInHub> playerConnections, ISignInService signInService) : base(eventBus)
        {
            _playerConnections = playerConnections;
            _signInService = signInService;
        }

        public async override Task OnConnectedAsync()
        {
            await base.OnConnectedAsync();
            _playerConnections.Add(Context.ConnectionId);
        }

        public async override Task OnDisconnectedAsync(Exception exception)
        {
            var playerId = _playerConnections.GetPlayerId(Context.ConnectionId).GetValueOrDefault();
            if (!playerId.Equals(Guid.Empty))
            {
                await _signInService.SignOutAsync(new PlayerSignOutRequest() {
                    PlayerId = playerId.ToString(),
                    TimestampText = DateTime.UtcNow.ToString()
                });
            }
            _playerConnections.Remove(Context.ConnectionId);
            await base.OnDisconnectedAsync(exception);
        }

        public async override Task OnClientRegisteredAsync(string connectionId, Guid clientId)
        {
            _playerConnections.SetPlayerId(connectionId, clientId);
            await Task.CompletedTask;
        }

        public async Task SignInAsync(Guid invocationId, PlayerSignInRequest request)
        {
            try
            {
                var signedInPlayer = await _signInService.SignInAsync(request);
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

    }
}