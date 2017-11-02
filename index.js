/**
 * Created by Mello on 27.07.2017.
 */

const canvas = document.getElementById('canvasDrawing');
const buttonArrow = document.getElementById('buttonArrow');
const buttonTurnLeft = document.getElementById('buttonTurnLeft');
const buttonTurnRight = document.getElementById('buttonTurnRight');
let angleRotate = 0;

function rotate(side) {
    let activeButton;
    let currentImgButton;
    let imgActiveButton;
    if (side === 'left') {
        angleRotate -= 90;
        activeButton = buttonTurnLeft;
        currentImgButton = 'url(\"img/left.png\")';
        imgActiveButton = 'url(\"img/leftOn.png\")';
    } else {
        angleRotate += 90;
        activeButton = buttonTurnRight;
        currentImgButton = 'url(\"img/right.png\")';
        imgActiveButton = 'url(\"img/rightOn.png\")';
    }

    activeButton.style.backgroundImage = imgActiveButton;
    canvas.style.transform = 'rotate(' + angleRotate + 'deg)';
    setTimeout(() => {
        activeButton.style.backgroundImage = currentImgButton;
    }, 800)
}

function draw() {
    if (canvas.getContext) {
        var ctx = canvas.getContext('2d');

        ctx.fillRect(25,25,100,100);
        ctx.clearRect(45,45,60,60);
        ctx.strokeRect(50,50,50,50);
    }
}