using Servor.Models;
using System.Net.WebSockets;
using System.Text;

namespace Servor.Services
{
    public sealed class PlayerManager
    {
        private readonly Dictionary<string, Player> _activePlayers = new();
        private readonly Dictionary<string, Player> _disconnectedPlayers = new();
        public PlayerManager() { }

        public Player? GetPlayerByName(string name) 
        {
            if (_activePlayers.ContainsKey(name))
                return _activePlayers[name];

            return null;
        }

        public async Task ConnectPlayer(WebSocket webSocket)
        {
            var buffer = new byte[1024 * 4];
            var receiveResult = await webSocket.ReceiveAsync(
                new ArraySegment<byte>(buffer), CancellationToken.None);
            string name;

            if (!receiveResult.CloseStatus.HasValue)
            {
                var str = Encoding.UTF8.GetString(buffer).Trim((char)0);

                if (str.StartsWith("My name is "))
                {
                    name = str.Replace("My name is ", "");
                    name = name.Substring(0, name.IndexOf("."));
                    await ConnectPlayer(name, webSocket);
                }
            }
        }

        public async Task<bool> ConnectPlayer(string name, WebSocket webSocket)
        {
            try
            {
                Console.WriteLine("Connecting player {0}", name);
                Player p;
                if (_activePlayers.ContainsKey(name))
                {
                    p = _activePlayers[name];
                    await p.Connection.CloseAsync(WebSocketCloseStatus.NormalClosure, "Another Connection with same name", CancellationToken.None);
                    p.Connection = webSocket;
                }
                else
                {
                    p = new(name, webSocket);
                    _activePlayers.Add(name, p);
                }
                await p.Activate();
                return true;
            }
            catch (Exception e)
            {
                return false;
            }
        }

        public async Task DisconnectPlayer(string name)
        {
            if (_activePlayers.TryGetValue(name, out Player? player))
            {
                Console.WriteLine("Disconnecting player {0}", name);
                if (player.Connection.State == WebSocketState.Open)
                    await player.Connection.CloseAsync(WebSocketCloseStatus.NormalClosure, "Disconnection requested", CancellationToken.None);
                _disconnectedPlayers.Remove(name);
                _disconnectedPlayers.Add(name, player);
                _activePlayers.Remove(name);
            }
        }

        public List<Player> GetActivePlayers()
        {
            return _activePlayers.Values.ToList();
        }

        public List<Player> GetOtherActivePlayers(string name)
        {
            return _activePlayers.Where(p => p.Key != name).Select(k => k.Value).ToList();
        }
    }
}
