export const drawCanvas = (canvas) => {
  let ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgb(118, 138, 100)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
};

export const drawPlayer = (canvas, x, y, isOther = false, name = "unknown") => {
  let ctx = canvas.getContext("2d");
  ctx.beginPath();
  ctx.arc(x, y, 5, 0, Math.PI * 2);
  ctx.fillStyle = isOther ? "#D10" : "#2D1";
  ctx.fill();
  ctx.font = "11px verdana";
  ctx.textAlign = "center";
  ctx.fillStyle = "#000";
  ctx.fillText(name, x, y - 20);
};

export const drawLevel = () => {
  let ctx = canvas.getContext("2d");
  ctx.fillStyle = "#000";
  level.forEach((row, ri) =>
    row.forEach((wall, ci) => {
      if (wall === "X") {
        ctx.beginPath();
        ctx.fillRect(10 * ci, 10 * ri, 10, 10);
      }
    })
  );
};

export const drawLevel2 = () => {
  let ctx = canvas.getContext("2d");
  ctx.fillStyle = "#000";
  for (var i = 0; i < level2.length; i++) {
    if (level2[i] === "X") {
      ctx.beginPath();
      ctx.fillRect(10 * (i % 50), 10 * Math.floor(i / 50), 10, 10);
    }
  }
};

export const movePlayer = (spd = 5) => {
  spd *= (keysDown["d"] || keysDown["a"]) && (keysDown["w"] || keysDown["s"]) ? 0.67 : 1;
  player.x += (keysDown["d"] - keysDown["a"]) * spd;
  player.y += (keysDown["s"] - keysDown["w"]) * spd;
};

export const connectToServer = () => {
  socket = new WebSocket("wss://localhost:7299");

  socket.onopen = () => {
    socket.send(`My name is ${player.name}.`);
  };

  socket.onmessage = (event) => {
    updatePlayers(event.data);
  };
};

export const updatePlayers = (data) => {
  data.text().then((t) => {
    //console.log(t);
    let players = ("" + t)
      .split(";")
      .map((p) => ({ name: p.split(":")[0], x: p.split(":")[1], y: p.split(":")[2] }));
    var newplayers = players.filter((p) => otherPlayers.findIndex((f) => f.name === p.name) === -1);
    var disconnectedplayers = otherPlayers.filter(
      (p) => players.findIndex((f) => f.name === p.name) === -1
    );
    otherPlayers.forEach((p) => {
      var ind = players.findIndex((f) => f.name === p.name);
      if (ind >= 0) {
        p.x = players[ind].x;
        p.y = players[ind].y;
      }
    });
    if (disconnectedplayers.length);
    disconnectedplayers.forEach((dp) =>
      otherPlayers.splice(
        otherPlayers.indexOf((op) => op.name == dp.name),
        1
      )
    );
    if (newplayers.length) otherPlayers.push(...newplayers);
  });
};
