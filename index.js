/**
 * Created by Mello on 27.07.2017.
 */

const canvas = document.getElementById('canvasDrawing');
const ctx = canvas.getContext('2d');
let arrayPaint = [];
let newArrayPaint = [];

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

//защита от эпилептичных нажатий на кнопки
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

function rotateObjects(angle) {
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
            rotateObjects(angleRotate);
            if (!(angleRotate % 90 || angleRotate % -90)) {
                clearInterval(interval);
                buttonOff(activeButton, currentImgButton);
            }
        }, 8.8);
    }
    angleRotate === 360 || angleRotate === -360 ? angleRotate = 0 : angleRotate;

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
                if (arrayPaint.length) {
                    for (let key in arrayPaint) {
                        let coord = arrayPaint[key];
                        let newX, newY, newW, newH;
                        switch (angleRotate) {
                            case -270:
                            case 90:
                                newX = canvas.width - coord.y;
                                newY = coord.x;
                                newW = canvas.width - coord.h;
                                newH = coord.w;
                                break;
                            case -180:
                            case 180:
                                newX = canvas.width - coord.x;
                                newY = canvas.height - coord.y;
                                newW = canvas.width - coord.w;
                                newH = canvas.height - coord.h;
                                break;
                            case -90:
                            case 270:
                                newX = coord.y;
                                newY = canvas.height - coord.x;
                                newW = coord.h;
                                newH = canvas.height - coord.w;
                                break;
                            default:
                                newX = coord.x;
                                newY = coord.y;
                                newW = coord.w;
                                newH = coord.h;
                                break;
                        }
                        let newCoord = {
                            x: newX,
                            y: newY,
                            w: newW,
                            h: newH
                        };
                        newArrayPaint.push(newCoord);
                    }
                    angleRotate = 0;
                    arrayPaint = newArrayPaint;
                    newArrayPaint = [];
                }
                arrowCoordinates = true;
                canvas.onmousemove = function (e) {
                    if (arrowCoordinates) {
                        rectW = e.offsetX == undefined ? e.layerX : e.offsetX;
                        rectH = e.offsetY == undefined ? e.layerY : e.offsetY;
                        let coordA = {
                            a1: rectX,
                            a2: rectY
                        };
                        let coordB = {
                            b1: rectW,
                            b2: rectH
                        }
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                        ctx.closePath();
                        arrowhead(coordA, coordB);
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

function paintArrow(B, C, K) {
    ctx.beginPath();
    ctx.moveTo(B.b1, B.b2);
    ctx.lineTo(C.c1, C.c2);
    ctx.lineTo(K.k1, K.k2);
    ctx.fill();
}

function arrowhead(A, B) {
let C = baseOfTheArrow(A, B).C;
let K = baseOfTheArrow(A, B).K;
paintArrow(B, C, K);
}

function arrowLength(A, B) {
    let h1 = 0.8 * B.b1 + 0.2 * A.a1;
    let h2 = 0.8 * B.b2 + 0.2 * A.a2;
    let f1 = 0.6 * B.b1 + 0.4 * A.a1;
    let f2 = 0.6 * B.b2 + 0.4 * A.a2;
    return {
        h1: h1,
        h2: h2,
        f1: f1,
        f2: f2
    }
}

function baseOfTheArrow(A, B) {

    let H = {
        h1: arrowLength(A, B).h1,
        h2: arrowLength(A, B).h2
    };
    let F = {
        f1: arrowLength(A, B).f1,
        f2: arrowLength(A, B).f2
    };

    let lengthHB = Math.sqrt(Math.pow((B.b1 - H.h1), 2) + Math.pow((B.b2 - H.h2), 2));  // |HB|
    let lengthHC = lengthHB / 2;
    let vectorFB = {
        fb1: B.b1 - F.f1,
        fb2: B.b2 - F.f2
    };

    let l = Math.sqrt(Math.pow(vectorFB.fb1, 2) + Math.pow(vectorFB.fb2, 2));
    let HC = {
        hc1: (-vectorFB.fb2*lengthHC) / l,
        hc2: (vectorFB.fb1*lengthHC) / l
    }
    let C = {
        c1: H.h1 + HC.hc1,
        c2: H.h2 + HC.hc2
    }
    let K = {
        k1: H.h1 - HC.hc1,
        k2: H.h2 - HC.hc2
    }
    return {
        C: C,
        K: K
    }
}