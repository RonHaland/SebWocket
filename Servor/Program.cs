using Servor.Models;
using Servor.Services;
using System.Diagnostics;
using System.Globalization;
using System.Net.WebSockets;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddHostedService<PlayerService>();
builder.Services.AddSingleton<PlayerManager>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseWebSockets();
CultureInfo.CurrentCulture = new CultureInfo("en");
var playerManager = app.Services.GetService<PlayerManager>();

app.Map("/", async (context) =>
{
    if (context.WebSockets.IsWebSocketRequest && playerManager != null)
    {
        using var webSocket = await context.WebSockets.AcceptWebSocketAsync();
        await playerManager.ConnectPlayer(webSocket);
    }
});

app.Run();
