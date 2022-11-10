using Servor.Models;
using System.Diagnostics;
using System.Net.WebSockets;
using System.Text;

var builder = WebApplication.CreateBuilder(args);
Dictionary<string, Player> players = new();

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseWebSockets();

app.Map("/", async (context) =>
{
    if (context.WebSockets.IsWebSocketRequest)
    {
        using var webSocket = await context.WebSockets.AcceptWebSocketAsync();
        await ConnectPlayer(webSocket);
    }
});

async Task ConnectPlayer(WebSocket webSocket)
{
    var c = new Stopwatch();
    c.Start();
    var i = 0;
    var buffer = new byte[1024 * 4];
    var receiveResult = await webSocket.ReceiveAsync(
        new ArraySegment<byte>(buffer), CancellationToken.None);
    var name = "";

    while (!receiveResult.CloseStatus.HasValue)
    {
        i++;
        if (i >= 60)
        {
            Console.WriteLine(c.ElapsedMilliseconds.ToString());
            c.Reset();
            c.Start();
            i = 0;
        }
        var str = Encoding.UTF8.GetString(buffer);

        if (str.StartsWith("My name is "))
        {
            name = str.Replace("My name is ", "");
            name = name.Substring(0,name.IndexOf("."));
            players.Add(name, new Player() { Name =  name});
        }
        else
        {
            var playerData = str.Split(":");
            if (playerData.Length >= 3)
            {
                var player = new Player
                {
                    Name = playerData[0],
                    X = double.Parse(playerData[1]),
                    Y = double.Parse(playerData[2].Substring(0, playerData[2].IndexOf(";"))),
                };
                if (players.ContainsKey(player.Name))
                    players[player.Name] = player;
            }
        }

        var otherPlayers = players.Where(p => p.Key != name).SelectMany(p => $"{p.Value.Name}:{p.Value.X}:{p.Value.Y}");
        var bytes = Encoding.UTF8.GetBytes(string.Join(";", otherPlayers));

        await webSocket.SendAsync(new ArraySegment<byte>(bytes), WebSocketMessageType.Binary, true, CancellationToken.None);

        receiveResult = await webSocket.ReceiveAsync(
            new ArraySegment<byte>(buffer), CancellationToken.None);
    }

    await webSocket.CloseAsync(
        receiveResult.CloseStatus.Value,
        receiveResult.CloseStatusDescription,
        CancellationToken.None);
    players.Remove(name);
}

app.Run();
