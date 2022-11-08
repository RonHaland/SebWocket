// Create WebSocket connection.
const socket = new WebSocket('wss://localhost:7299/ws');

// Connection opened
socket.addEventListener('open', (event) => {
    socket.send('Hello Server!');
});

// Listen for messages
socket.addEventListener('message', (event) => {
    console.log('Message from server ', event.data);
});

var frames = 0;

const player = {
    x: 20,
    y: 20,
};

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
    drawCanvas(canvas);
    drawPlayer(canvas, player.x, player.y, false);
    drawPlayer(canvas, 50, 70, true);

    
    setInterval(async (a) => {
        if (socket !== null && socket.readyState === 1){
            socket.send(`x${player.x}y${player.y}`);
        };
        movePlayer();
        drawCanvas(canvas);
        drawPlayer(canvas, player.x, player.y, false);
        drawPlayer(canvas, 50, 70, true);
        frames += 1;
    }, 3)

    setInterval(async () => {
        console.log(frames);
        frames = 0;
    }, 1000);
};


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
