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
let coordA, coordB;

function paint(A, B) {
    ctx.beginPath();
    ctx.moveTo(A.a1, A.a2);
    ctx.lineTo(B.b1, B.b2);
    ctx.stroke();
}

function paintAllFigure() {
    if (arrayPaint.length) {
        for (let key in arrayPaint) {
            let coord = arrayPaint[key];
            paint(coord.A, coord.B);
            arrowhead(coord.A, coord.B);
        }
    }
}

function stopPaint() {
    arrowCoordinates = false;
    painted = false;
}

function addCoordinates(A, B) {
    let coordinates = {
        A: {
            a1: A.a1,
            a2: A.a2
        },
        B: {
            b1: B.b1,
            b2: B.b2
        }
    };
    arrayPaint.push(coordinates);
}

function rotatePaint() {
    if (arrayPaint.length) {
        for (let key in arrayPaint) {
            let item = arrayPaint[key];
            let coordinates;
            switch (angleRotate) {
                case -270:
                case 90:
                    coordinates = {
                        newA: {
                            a1: canvas.width - item.A.a2,
                            a2: item.A.a1
                        },
                        newB: {
                            b1: canvas.width - item.B.b2,
                            b2: item.B.b1
                        }
                    };
                    break;
                case -180:
                case 180:
                    coordinates = {
                        newA: {
                            a1: canvas.width - item.A.a1,
                            a2: canvas.height - item.A.a2
                        },
                        newB: {
                            b1: canvas.width - item.B.b1,
                            b2: canvas.height - item.B.b2
                        }
                    };
                    break;
                case -90:
                case 270:
                    coordinates = {
                        newA: {
                            a1: item.A.a2,
                            a2: canvas.height - item.A.a1
                        },
                        newB: {
                            b1: item.B.b2,
                            b2: canvas.height - item.B.b1
                        }
                    };
                    break;
                default:
                    coordinates = {
                        newA: {
                            a1: item.A.a1,
                            a2: item.A.a2
                        },
                        newB: {
                            b1: item.B.b1,
                            b2: item.B.b2
                        }
                    };
                    break;
            }
            let newCoord = {
                A: coordinates.newA,
                B: coordinates.newB,
            };
            newArrayPaint.push(newCoord);
        }
        angleRotate = 0;
        arrayPaint = newArrayPaint;
        newArrayPaint = [];
    }
}

//остановить рисование при повторном нажатии на кнопку "стрелка"
let drowed = 0;

function draw(btn) {
    painted = true;
    drowed++;
    if (drowed > 1) {
        stopPaint();
        buttonOff(activeButton, currentImgButton);
        drowed = 0;
        painted = false;
        rotatePaint();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        paintAllFigure();
    }
    if (painted && stopButtonOn()) {
        buttonOn(btn);
        if (canvas.getContext) {
            ctx.fillStyle = '#000000';
            canvas.onclick = (event) => {
                if (painted) {
                    ctx.lineWidth = 2;
                    rectX = event.offsetX;
                    rectY = event.offsetY;
                    rotatePaint();
                    arrowCoordinates = true;
                    canvas.onmousemove = function (e) {

                        if (arrowCoordinates) {
                            rectW = e.offsetX == undefined ? e.layerX : e.offsetX;
                            rectH = e.offsetY == undefined ? e.layerY : e.offsetY;
                            coordA = {
                                a1: rectX,
                                a2: rectY
                            };
                            coordB = {
                                b1: rectW,
                                b2: rectH
                            };
                            ctx.clearRect(0, 0, canvas.width, canvas.height);
                            ctx.closePath();
                            arrowhead(coordA, coordB);
                            paint(coordA, coordB);
                            paintAllFigure();
                            canvas.onclick = () => {
                                if (painted) {
                                    ctx.closePath();
                                    stopPaint();
                                    buttonOff(activeButton, currentImgButton);
                                    addCoordinates(coordA, coordB);
                                    drowed = 0;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

//Тут тригонометрия, название переменных такие для удобства. Рисунок к рассчетам выложен на гитхабе

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
    let sizeArrow1 = 0.15;
    let sizeArrow2 = 0.3;
    let h1 = (1 - sizeArrow1) * B.b1 + sizeArrow1 * A.a1;
    let h2 = (1 - sizeArrow1) * B.b2 + sizeArrow1 * A.a2;
    let f1 = (1 - sizeArrow2) * B.b1 + sizeArrow2 * A.a1;
    let f2 = (1 - sizeArrow2) * B.b2 + sizeArrow2 * A.a2;
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
        hc1: (-vectorFB.fb2 * lengthHC) / l,
        hc2: (vectorFB.fb1 * lengthHC) / l
    };
    let C = {
        c1: H.h1 + HC.hc1,
        c2: H.h2 + HC.hc2
    };
    let K = {
        k1: H.h1 - HC.hc1,
        k2: H.h2 - HC.hc2
    };
    return {
        C: C,
        K: K
    };
}