const drawCanvas = (canvas) => {
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#aaa";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

const drawPlayer = (canvas, x, y, isOther = false) => {
    let ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fillStyle = isOther ? "#D10" : "#2D1";
    ctx.fill();
}

const movePlayer = (spd = 5) => {
    spd *= (keysDown['d'] || keysDown['a']) && (keysDown['w'] || keysDown['s']) ? 0.67 : 1;
    player.x += (keysDown['d'] - keysDown['a']) * spd;
    player.y += (keysDown['s'] - keysDown['w']) * spd;
}