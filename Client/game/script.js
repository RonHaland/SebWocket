// // Create WebSocket connection.
// socket = new WebSocket('wss://localhost:7299');

// // Connection opened
// socket.addEventListener('open', (event) => {
//     socket.send(`My name is ${player.name}.`);
// });

// // Listen for messages
// socket.addEventListener('message', (event) => {
//     event.data.text().then(t => {
//         //console.log(t);
//         let players = ("" + t).split(';').map(p => ({ name: p.split(':')[0], x: p.split(':')[1], y: p.split(':')[2] }));
//         var newplayers = players.filter(p => otherPlayers.findIndex(f => f.name === p.name) === -1);
//         var disconnectedplayers = otherPlayers.filter(p => players.findIndex(f => f.name === p.name) === -1);
//         otherPlayers.forEach(p => {
//             var ind = players.findIndex(f => f.name === p.name);
//             if (ind >= 0){
//                 p.x = (players[ind].x);
//                 p.y = (players[ind].y);
//             }
//         });
//         if (disconnectedplayers.length);
//             disconnectedplayers.forEach(dp => otherPlayers.splice(otherPlayers.indexOf(op => op.name == dp.name), 1));
//         if (newplayers.length)
//             otherPlayers.push(...newplayers);
//     });
//     //let players = ("" + event.data.text()).split(';').map(p => ({ name: p.split(':')[0], x: p.split(':')[1], y: p.split(':')[2] }));
//     //console.log(otherPlayers);
// });

var socket;

var frames = 0;

const player = {
    x: 250,
    y: 250,
    name: "ron" + Math.floor(Math.random() * 20)
};

const otherPlayers = [];

const keysDown = {
    w: false,
    a: false,
    s: false,
    d: false
};

var canvas;
//canvas setup

onload = (event) => { 
    canvas = document.getElementById("canv");
    connectToServer();
    loop();
    setInterval(async (a) => {
        if (socket !== undefined && socket.readyState === 1){
            socket.send(`${player.name}:${player.x}:${player.y}:;`);
        }
        else if (otherPlayers.length){
            otherPlayers.splice(0, otherPlayers.length);
        }
        movePlayer();
    }, 20);

    setInterval(async () => {
        console.log(frames);
        frames = 0;
        console.log(otherPlayers);
        if (socket === undefined || socket.readyState === socket.CLOSED) {
            console.log("connecting...");
            connectToServer();
        }
    }, 2000);
};

//Loop

const loop = () => {
    drawCanvas(canvas);
    otherPlayers.forEach(op => 
        drawPlayer(canvas, op.x, op.y, true, op.name)
    );

    drawPlayer(canvas, player.x, player.y, false, player.name);
    drawLevel2();
    frames += 1;

    window.requestAnimationFrame(loop);
}

//key events
onkeydown = (event) => {
    var key = event.key;
    switch (key){
        case 'w':
        case 'a':
        case 's':
        case 'd':
            keysDown[key] = true;
            break;
    }
}
onkeyup = (event) => {
    var key = event.key;
    switch (key){
        case 'w':
        case 'a':
        case 's':
        case 'd':
            keysDown[key] = false;
            break;
    }
}
