using Servor.Models;
using Servor.Services;
using System.Diagnostics;
using System.Net.WebSockets;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddHostedService<PlayerService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseWebSockets();

var playerService = app.Services.GetService<PlayerService>();

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
    var buffer = new byte[1024 * 4];
    var receiveResult = await webSocket.ReceiveAsync(
        new ArraySegment<byte>(buffer), CancellationToken.None);
    var name = "";

    if (!receiveResult.CloseStatus.HasValue)
    {
        var str = Encoding.UTF8.GetString(buffer);

        if (str.StartsWith("My name is "))
        {
            name = str.Replace("My name is ", "");
            name = name.Substring(0, name.IndexOf("."));
            var player = new Player(name, webSocket);
            playerService.PlayerList.Add(name, player);
            await player.Activate();
        }
    }
}

app.Run();
