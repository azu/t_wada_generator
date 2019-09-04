// LICENSE : MIT
"use strict";
function loadImage(imagePath) {
    return new Promise(function(resolve, reject) {
        var img = new Image();
        img.addEventListener('load', function() {
            resolve(img);
        });
        img.src = imagePath;
    });
}
// http://jsdo.it/tam0927/AqQn
function roundRect(ctx, x, y, w, h, r) {
    ctx.moveTo(x, y + r);
    ctx.lineTo(x, y + h - r);
    ctx.quadraticCurveTo(x, y + h, x + r, y + h);
    ctx.lineTo(x + w - r, y + h);
    ctx.quadraticCurveTo(x + w, y + h, x + w, y + h - r);
    ctx.lineTo(x + w, y + r);
    ctx.quadraticCurveTo(x + w, y, x + w - r, y);
    ctx.lineTo(x + r, y);
    ctx.quadraticCurveTo(x, y, x, y + r);
}
function drawFukidashi(ctx) {
    ctx.shadowBlur = 8.0;
    ctx.shadowOffsetX = 1.0;
    ctx.shadowOffsetY = 1.0;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
    ctx.fillStyle = '#FFF';
    ctx.beginPath();
    roundRect(ctx, 10, 60, 300, 300, 12);
    ctx.moveTo(350, 150);
    ctx.lineTo(10, 250);
    ctx.lineTo(250, 280);
    ctx.closePath();
    ctx.fill();
}
function wrapText(ctx, text) {
    var x = 30, y = 100, maxWidth = 275, lineHeight = 25;
    var words = text.split('');
    var line = '';
    ctx.font = "24px 'Monotype Corsiva'";
    ctx.fillStyle = '#000';
    for (var n = 0; n < words.length; n++) {
        var testLine = line + words[n] + ' ';
        var metrics = ctx.measureText(testLine);
        var testWidth = metrics.width;
        if (words[n] === '\n' || testWidth > maxWidth && n > 0) {
            ctx.fillText(line, x, y);
            if (words[n] === '\n') {
                line = '';
            } else {
                line = words[n] + ' ';
            }
            y += lineHeight;
        } else {
            line = testLine;
        }
    }
    ctx.fillText(line, x, y);
}
function draw(ctx, size, text) {
    loadImage("./resources/t_wada.png").then(function(image) {
        ctx.clearRect(0, 0, size.width, size.height);
        ctx.drawImage(image, 0, 0, size.width, size.height);
        drawFukidashi(ctx);
        wrapText(ctx, text);
    });
}

function main() {
    var canvasSize = {
        width: 720,
        height: 450
    };
    var textarea = document.querySelector("#js-textarea");
    textarea.addEventListener("input", function(event) {
        var text = event.target.value;
        draw(ctx, canvasSize, text);
    });
    var canvas = document.querySelector("#js-canvas");
    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;
    var ctx = canvas.getContext('2d');
    draw(ctx, canvasSize, textarea.value);
    canvas.addEventListener("click", function(event) {
        event.currentTarget.toBlob(function(blob) {
            var a = document.createElement("a");
            a.download = "t_wada.png";
            a.href = URL.createObjectURL(blob);
            a.click();
            URL.revokeObjectURL(blob);
        }, "image/png", 0.9);
    });
}
window.onload = function() {
    main();
};
