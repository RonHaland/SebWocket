using Servor.Models;
using System.Net.WebSockets;
using System.Text;

namespace Servor.Services
{
    public class PlayerService : BackgroundService
    {
        private readonly PlayerManager _playerManager;

        public PlayerService(PlayerManager playerManager)
        {
            _playerManager = playerManager;
        }

        protected override Task ExecuteAsync(CancellationToken stoppingToken)
        {
            return Task.Run(async () => 
            { 
                while (true)
                {
                    foreach(var player in _playerManager.GetActivePlayers())
                    {
                        if (player.Connection.State != WebSocketState.Open && player.Connection.State != WebSocketState.Connecting)
                        {
                            await _playerManager.DisconnectPlayer(player.Name);
                            continue;
                        }

                        var otherPlayers = _playerManager.GetOtherActivePlayers(player.Name).Select(p => $"{p.Name}:{p.X}:{p.Y}");
                        var bytes = Encoding.UTF8.GetBytes(string.Join(";", otherPlayers));

                        await player.Connection.SendAsync(new ArraySegment<byte>(bytes), WebSocketMessageType.Binary, true, CancellationToken.None);
                    }
                    await Task.Delay(25);
                }
            });
        }
    }
}
