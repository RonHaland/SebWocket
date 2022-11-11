// Create WebSocket connection.
const socket = new WebSocket('wss://localhost:7299');

// Connection opened
socket.addEventListener('open', (event) => {
    socket.send(`My name is ${player.name}.`);
});

// Listen for messages
socket.addEventListener('message', (event) => {
    event.data.text().then(t => {
        console.log(t);
        let players = ("" + t).split(';').map(p => ({ name: p.split(':')[0], x: p.split(':')[1], y: p.split(':')[2] }));
        var newplayers = players.filter(p => otherPlayers.findIndex(f => f.name === p.name) === -1);
        otherPlayers.forEach(p => {
            var ind = players.findIndex(f => f.name === p.name);
            if (ind >= 0){
                p.x = (players[ind].x);
                p.y = (players[ind].y);
            }
        });
        if (newplayers.length)
            otherPlayers.push(...newplayers);
    });
    //let players = ("" + event.data.text()).split(';').map(p => ({ name: p.split(':')[0], x: p.split(':')[1], y: p.split(':')[2] }));
    console.log(otherPlayers);
});

var frames = 0;

const player = {
    x: 20,
    y: 20,
    name: "ron1" + Math.floor(Math.random() * 20)
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
    Loop();
    setInterval(async (a) => {
        if (socket !== null && socket.readyState === 1){
            socket.send(`${player.name}:${player.x}:${player.y}:;`);
        };
        movePlayer();
    }, 20);

    setInterval(async () => {
        console.log(frames);
        frames = 0;
    }, 1000);
};

//Loop

const Loop = () => {
    drawCanvas(canvas);
    otherPlayers.forEach(op => 
        drawPlayer(canvas, op.x, op.y, true)
    );

    drawPlayer(canvas, player.x, player.y, false);
    frames += 1;

    window.requestAnimationFrame(Loop);
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
