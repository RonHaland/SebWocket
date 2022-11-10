using Servor.Models;
using System.Net.WebSockets;
using System.Text;

namespace Servor.Services
{
    public class PlayerService : BackgroundService
    {
        public PlayerService()
        {
            PlayerList = new();
        }

        public Dictionary<string, Player> PlayerList { get; }

        protected override Task ExecuteAsync(CancellationToken stoppingToken)
        {
            return Task.Run(async () => 
            { 
                while (true)
                {
                    foreach(var player in PlayerList.Values)
                    {
                        if (player.Connection.State != WebSocketState.Open && player.Connection.State != WebSocketState.Connecting)
                        {
                            PlayerList.Remove(player.Name);
                            continue;
                        }

                        var otherPlayers = PlayerList.Where(p => p.Key != player.Name).Select(p => $"{p.Value.Name}:{p.Value.X}:{p.Value.Y}");
                        var bytes = Encoding.UTF8.GetBytes(string.Join(";", otherPlayers));

                        await player.Connection.SendAsync(new ArraySegment<byte>(bytes), WebSocketMessageType.Binary, true, CancellationToken.None);
                    }
                    await Task.Delay(50);
                }
            });
        }
    }
}
