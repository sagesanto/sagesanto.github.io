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
function populateGrid(){   
    console.log("populating");
    val = "repeat(40,1fr)";
    val = val.replace("*",String(Math.trunc(window.innerWidth/46)));
    let grid = document.getElementById("gridContainer");
    console.log("equality:",val === grid.getAttribute("grid-template-columns"));
    grid.setAttribute("grid-template-columns", val);
    console.log(grid.getAttribute('grid-template-columns'));
    console.log("size:",Math.trunc(window.innerWidth/46))
    for(let i = 0; i < 10; i++){
        for (let i = 0; i < 75; i++) {
            let item = document.createElement("img");
            item.setAttribute("class", "pixel");
            item.addEventListener("click", function() { togglePixel(item); });
            item.setAttribute("src","dot.png");
            grid.appendChild(item);
        }
    }
}

function getColorIndicesForCoord(x, y, width) {
    var red = y * (width * 4) + x * 4;
    return [red, red + 1, red + 2, red + 3];
  }
function manageCanvas(){
    //init
    canvas = document.getElementById("textCanvas")
    ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = "rgb(200,10,10)"
    ctx.font = "10px EB Garamond";
    ctx.fillText(phrases,0,23);
    //end init
    width = canvas.width;
    // canvas.height = 50;
    height = canvas.height;
    var data = ctx.getImageData(0,0,width,height).data;  
}

function togglePixel(item){
    console.log("click");
    item.setAttribute("src","redDot.png");
}