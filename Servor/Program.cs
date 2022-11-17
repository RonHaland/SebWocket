using Servor.Services;
using System.Globalization;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddHostedService<PlayerService>();
builder.Services.AddSingleton<PlayerManager>();
builder.Services.AddCors();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors(p => p.AllowAnyMethod().AllowAnyHeader().SetIsOriginAllowed((_) => true));

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

app.MapGet("/up", () => "");

app.Run();
