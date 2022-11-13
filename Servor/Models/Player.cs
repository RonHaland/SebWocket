using System.Globalization;
using System.Net.WebSockets;
using System.Text;

namespace Servor.Models;

public sealed class Player
{
    public Player(string name, WebSocket connection)
    {
        Name = name;
        Connection = connection;
    }

    public double X { get; set; }
    public double Y { get; set; }
    public string Name { get; set; }
    public WebSocket Connection { get; set; }

    public async Task Activate()
    {
        var buffer = new byte[1024 * 4];
        var receiveResult = await Connection.ReceiveAsync(
            new ArraySegment<byte>(buffer), CancellationToken.None);
        while (!receiveResult.CloseStatus.HasValue)
        {
            try
            {
                var data = Encoding.UTF8.GetString(buffer);
                var playerData = data.Split(":");
                if (playerData.Length >= 3)
                {
                    Name = playerData[0];
                    X = double.Parse(playerData[1], CultureInfo.InvariantCulture);
                    Y = double.Parse(playerData[2], CultureInfo.InvariantCulture);
                }
            }
            catch (Exception)
            {
                Console.WriteLine("error");
            }

            receiveResult = await Connection.ReceiveAsync(
                new ArraySegment<byte>(buffer), CancellationToken.None);
        }

        await Connection.CloseAsync(
            receiveResult.CloseStatus.Value,
            receiveResult.CloseStatusDescription,
            CancellationToken.None);
    }
}
