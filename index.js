/**
 * Created by Mello on 27.07.2017.
 */

const canvas = document.getElementById('canvasDrawing');
const ctx = canvas.getContext('2d');
let arrayPaint = [];

const buttonArrow = document.getElementById('buttonArrow');
const buttonTurnLeft = document.getElementById('buttonTurnLeft');
const buttonTurnRight = document.getElementById('buttonTurnRight');

const rotateLeft = 'url(\"img/left.png\")', rotateLeftOn = 'url(\"img/leftOn.png\")',
    rotateRight = 'url(\"img/right.png\")', rotateRightOn = 'url(\"img/rightOn.png\")';
const arrow = 'url(\"img/arrow.png\")', arrowOn = 'url(\"img/arrowOn.png\")';

let angleRotate = 0;
let imgActiveButton = '';
let activeButton = '';
let currentImgButton;
let interval;

//защита от многократных нажатий на кнопки
function stopButtonOn() {
    return !(imgActiveButton);
}

function inRad(num) {
    return num * Math.PI / 180;
}

function buttonOn(onButton) {
    switch (onButton) {
        case 'left':
            activeButton = buttonTurnLeft;
            currentImgButton = rotateLeft;
            imgActiveButton = rotateLeftOn;
            activeButton.style.backgroundImage = imgActiveButton;
            break;
        case 'right':
            activeButton = buttonTurnRight;
            currentImgButton = rotateRight;
            imgActiveButton = rotateRightOn;
            activeButton.style.backgroundImage = imgActiveButton;
            break;
        case 'arrow':
            activeButton = buttonArrow;
            currentImgButton = arrow;
            imgActiveButton = arrowOn;
            activeButton.style.backgroundImage = imgActiveButton;
            break;
    }
}

function buttonOff(currentButton, noActiveButton) {
    currentButton.style.backgroundImage = noActiveButton;
    imgActiveButton = '';
}

function rotateTime(angle) {
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(inRad(angle));
    ctx.translate(-canvas.width / 2, -canvas.height / 2);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    paintAllFigure();
    ctx.restore();
}

function rotate(side) {
    if (stopButtonOn()) {
        buttonOn(side);
        interval = setInterval(() => {
            side === 'left' ? angleRotate -= 1 : angleRotate += 1;
            rotateTime(angleRotate);
            if (!(angleRotate % 90 || angleRotate % -90)) {
                clearInterval(interval);
                buttonOff(activeButton, currentImgButton);
            }
        }, 8.8);
    }
}

let painted = false;
let arrowCoordinates = false;
let rectX = 0, rectY = 0, rectW = 0, rectH = 0;

function paint(x, y, w, h) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(w, h);
    ctx.stroke();
}

function paintAllFigure() {
    if (arrayPaint.length) {
        for (let key in arrayPaint) {
            let coord = arrayPaint[key];
            paint(coord.x, coord.y, coord.w, coord.h);
        }
    }
}

function stopPaint() {
    arrowCoordinates = false;
    painted = false;
}

function addCoordinates(x, y, w, h) {
    let coordinates = {
        x: x,
        y: y,
        w: w,
        h: h
    }
    arrayPaint.push(coordinates);
}

function draw(btn) {
    painted = true;
    if (painted && stopButtonOn()) {
        buttonOn(btn);
        if (canvas.getContext) {
            ctx.fillStyle = '#000000';
            canvas.onclick = (event) => {
                ctx.lineWidth = 2;
                rectX = event.offsetX;
                rectY = event.offsetY;
                arrowCoordinates = true;
                canvas.onmousemove = function (e) {
                    if (arrowCoordinates) {
                        rectW = e.offsetX == undefined ? e.layerX : e.offsetX;
                        rectH = e.offsetY == undefined ? e.layerY : e.offsetY;
                        console.log(rectW, rectH)
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                        ctx.closePath();
                        paint(rectX, rectY, rectW, rectH);
                        paintAllFigure();
                        canvas.onclick = () => {
                            ctx.closePath();
                            stopPaint();
                            buttonOff(activeButton, currentImgButton);
                            addCoordinates(rectX, rectY, rectW, rectH)
                        }
                    }
                }
            }
        }
    }
}

