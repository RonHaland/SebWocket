//#region imports
import { level2 } from "./level";
//#endregion
//#region globals
var socket;

//var frames = 0;

const player = {
  x: 250,
  y: 250,
  name: "ron" + Math.floor(Math.random() * 20),
};

const otherPlayers = [];

const keysDown = {
  w: false,
  a: false,
  s: false,
  d: false,
};

var canvas;
//#endregion

//#region Setup and loop
onload = () => {
  canvas = document.getElementById("canv");
  connectToServer();
  loop();
  setInterval(async () => {
    if (socket !== undefined && socket.readyState === 1) {
      socket.send(`${player.name}:${player.x}:${player.y}:;`);
    } else if (otherPlayers.length) {
      otherPlayers.splice(0, otherPlayers.length);
    }
    movePlayer();
  }, 20);

  setInterval(async () => {
    //console.log(frames);
    frames = 0;
    //console.log(otherPlayers);
    if (socket === undefined || socket.readyState === socket.CLOSED) {
      //console.log("connecting...");
      connectToServer();
    }
  }, 2000);
};

const loop = () => {
  drawCanvas(canvas);
  otherPlayers.forEach((op) => drawPlayer(canvas, op.x, op.y, true, op.name));

  drawPlayer(canvas, player.x, player.y, false, player.name);
  drawLevel2();
  frames += 1;

  window.requestAnimationFrame(loop);
};

//#endregion

//#region key events
onkeydown = (event) => {
  var key = event.key;
  switch (key) {
    case "w":
    case "a":
    case "s":
    case "d":
      keysDown[key] = true;
      break;
  }
};
onkeyup = (event) => {
  var key = event.key;
  switch (key) {
    case "w":
    case "a":
    case "s":
    case "d":
      keysDown[key] = false;
      break;
  }
};
//#endregion

//#region functions
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
//#endregion
