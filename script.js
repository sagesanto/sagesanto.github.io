var phrases = "open 7am-11pm    closed! return later    truly these are the last days    there exists a nomadic science    there is water at the bottom of the ocean    the bell tolls for thee    days without cthulhu:         they’re stars that are facing the end    you do not recognize the bodies in the water   rebellion gets really easy when you make so many fucking rules    the enemy doesn’t arrive by boat he arrives by limousine   it would seem that a whole nomad science develops eccentrically, one that is very different from the royal or imperial sciences.    those who own for a living rule those who work for a living    more confident, capable, farseeing, and prudent"
async function flashbang(callingElement)
{
    callingElement.disabled = true;
    await sleep(getRandomInt(15000))
    let myModal = document.getElementById('myModal');
    myModal.style.display = "block";
    console.log(callingElement);   
    var flash = new Audio('audio1.mp3');
    audio.play();
    audio.addEventListener('ended', (event) => {
        callingElement.disabled = false;
        myModal.style.display = "none";
    });
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
var num;
function populateGrid(){
    let root = document.documentElement;
    toggled = true;
    console.log("populating");
    num = Math.trunc(((window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth)-20)/16);
    root.style.setProperty('--numCols', num);
    let grid = document.getElementById("gridContainer");
    console.log("cols: ",grid.getAttribute('grid-template-columns'));
    console.log("size: ", num)
    for(let i = 0; i < 10; i++){
        for (let i = 0; i <num; i++) {

            let item = document.createElement("img");
            item.setAttribute("class", "pixel");
            item.addEventListener("click", function() { togglePixel(item); });
            item.setAttribute("src","dot.png");
            toggled = !toggled
            if(toggled)
            {
                togglePixel(item);
            }
            grid.appendChild(item);
        }
    }
}

function getColorIndicesForCoord(x, y, width) {
    var red = y * (width * 4) + x * 4;
    return [red, red + 1, red + 2, red + 3];
  }
function manageCanvas(){
    let root = document.documentElement;
    var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    canvas = document.getElementById("textCanvas");
    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = "rgb(200,10,10)";
    ctx.font = "160px EB Garamond";
    width = ctx.canvas.width;
    ctx.strokeText(phrases,0,80);
    height = ctx.canvas.height;
    var data = Array.from(ctx.getImageData(0,0,width,160).data);
    var pixels = [];
    for(let i = 3; i < data.length; i += 4)
    {
        pixels.push(data[i])
    }
    
    console.log("Pixels: ", pixels)
}

function togglePixel(item){
    console.log("click");
    item.setAttribute("src","redDot.png");
}