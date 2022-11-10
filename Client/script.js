// Create WebSocket connection.
const socket = new WebSocket('wss://localhost:7299');

// Connection opened
socket.addEventListener('open', (event) => {
    socket.send(`My name is ${player.name}.`);
});

// Listen for messages
socket.addEventListener('message', (event) => {
    console.log('Message from server ', event.data);
    let players = ("" + event.data).split(';').map(p => ({ name: p.split(':')[0], x: p.split(':')[1], y: p.split(':')[2] }));
});

var frames = 0;

const player = {
    x: 20,
    y: 20,
    name: "ron2"
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
            socket.send(`${player.name}:${player.x}:${player.y};`);
        };
        movePlayer();
    }, 1)

    setInterval(async () => {
        console.log(frames);
        frames = 0;
    }, 1000);
};

//Loop

const Loop = () => {
    drawCanvas(canvas);
    drawPlayer(canvas, player.x, player.y, false);
    drawPlayer(canvas, 50, 70, true);
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
