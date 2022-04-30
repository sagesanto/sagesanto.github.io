var phrases = "open 7am-11pm    closed! return later    truly these are the last days    there exists a nomadic science    there is water at the bottom of the ocean    the bell tolls for thee    days without cthulhu: -1    they’re stars that are facing the end    you do not recognize the bodies in the water   i want to dance with devils on dead stars   rebellion gets really easy when you make so many fucking rules    the enemy doesn’t arrive by boat he arrives by limousine   it would seem that a whole nomad science develops eccentrically, one that is very different from the royal or imperial sciences.    those who own for a living rule those who work for a living    more confident, capable, farseeing, and prudent    "


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

function tick()
{
    runCanvasTick(pixelGrid);
    console.log("tick")
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
var num;
let gridItems = Array.from(Array(20), () => new Array());
function populateGrid(){
    let root = document.documentElement;
    toggled = true;
    console.log("populating");
    num = Math.trunc(((window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth)-20)/10);
    root.style.setProperty('--numCols', num);
    let grid = document.getElementById("gridContainer");
    console.log("cols: ",grid.getAttribute('grid-template-columns'));
    console.log("size: ", num)
    for(let i = 0; i < 20; i++){
        for (let j = 0; j <num; j++) {
            var item = document.createElement("img");
            item.setAttribute("class", "pixel");
            item.addEventListener("click", function() { togglePixel(item); });
            item.setAttribute("src","dot.png");
            gridItems[i].push(item);
            grid.appendChild(item);

      //    debugging
            toggled = !toggled
            if(toggled)
            {
                togglePixel(item);
            }
        }
    }
    console.log(grid)
}

function getColorIndicesForCoord(x, y, width) { //not relevant
    var red = y * (width * 4) + x * 4;
    return [red, red + 1, red + 2, red + 3];
  }

function manageCanvas(){
    let canvDrawWidth = 6687;
    let root = document.documentElement;
    var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    canvas = document.getElementById("textCanvas");
    const ctx = canvas.getContext("2d");
    ctx.textBaseline = "top";
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = "rgb(200,10,10)";
    ctx.font = "18pt Calibri";
    console.log("width: ", width)

    canv2 = document.getElementById("reconstructCanvas");
    const ctx2 = canv2.getContext("2d");
    ctx2.canvas.width = canvDrawWidth;
    ctx2.canvas.height = 20;

    height = ctx.canvas.height;
    ctx.canvas.width = canvDrawWidth;
    ctx.canvas.height = 20;

    ctx.fillText(phrases,0,10);
    var data = Array.from(ctx.getImageData(0,0,canvDrawWidth,20).data);
    ctx2.putImageData(ctx.getImageData(0,0,canvDrawWidth,20), 0,0)

    var pixels = [];
    count = 0;
    for(let i = 3; i < data.length; i += 4) //only looking at alpha
    {
        pixels.push(data[i])
        data[i] != 0 ? count += 1 : count += 0 //debugging purposes
    }
    console.log("count: ",count)
    console.log("pixels: ",pixels)

    pixelGrid = []
    for(let i = 0; i < 20; i ++)
    {
        pixelGrid.push(pixels.slice(0,canvDrawWidth))
    }
    //pixel grid is a vector of rows indexible by [column, row]  //console.log("good pixels: ", nonEmpty)
    console.log("Pixels Grid: ", pixelGrid)

    setInterval(runCanvasTick,17,pixelGrid) //roughly 60fps //doesnt work
}
//should probably just make the whole canvas a class

function setState(desiredState){ //take an array with row# of col#-length array, set the state of the grid to match
    //state is indexibile by [col,row], unfortunately
    //man i just want pandas dataframes

    let numCols = desiredState.length
    let numRows = desiredState[0].length

    let turnOn = []
    let turnOff = []
    console.log("desired: ",desiredState)
    for(let i = 0; i < numCols; i ++)
    {
        for(let j = 0; j < numRows; j ++)
        {
//            console.log("desired state at ", j, ", ",i, " is ",desiredState[i][j])
            if(desiredState[i][j] !=0){
                turnOn.push(gridItems[i][j])
            }
            else{
                turnOff.push(gridItems[i][j])
            }
        }
    }
    turnPixelsOn(turnOn)
    turnPixelsOff(turnOff)
}
let pointer = 0;
function runCanvasTick(pixelsGridData) //use a callback function on a timer to call it
{
    canvas = document.getElementById("textCanvas");
    const ctx = canvas.getContext("2d");
    console.log("ticking")
    console.log("gridItems in runCanvas: ",gridItems)
    console.log(Array.isArray(gridItems[0]))
    let gridWidth = gridItems[0].length
    console.log("gridWidth:", gridWidth)
    let width = pixelsGridData[0].length
    let height = pixelsGridData.length
    let state = Array.from(Array(20), () => new Array());

    for(let i = 0; i < height; i++)
    {
        ctx.beginPath();
        for(let j = 0; j < gridWidth; j++)
        {
            ctx.rect((j+pointer)%width, i, 1, 1);
            state[i][j] = (pixelsGridData[i][(j+pointer)%width] == 0 ? 0 : 1)
        }
        ctx.stroke();
    }
    pointer+=1
    setState(state)
    //make the thing go - write algorithm to generate desired state to pass to the setState function
}

function turnPixelsOff(pixels){
    console.log("turnOff: ",pixels)
    for(let i =0; i < pixels.length; i ++)
    {
        turnPixelOff(pixels[i])
    }
}
function turnPixelsOn(pixels){
    console.log("turnOn: ",pixels)
    for(let i =0; i < pixels.length; i ++)
    {
        turnPixelOn(pixels[i])
    }
}

function turnPixelOn(item){
    if(item.getAttribute("src") == "redDot.png")
    {
        return;
    }
    togglePixel(item)
}

function turnPixelOff(item){
    if(item.getAttribute("src") != "redDot.png")
    {
        return;
    }
    togglePixel(item)
}

function togglePixel(item){
    let isOn = item.getAttribute("src") == "redDot.png"
    isOn ? item.setAttribute("src","dot.png") : item.setAttribute("src","redDot.png");
}

populateGrid()
manageCanvas()