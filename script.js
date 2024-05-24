var phrases = ["truly these are the last days", "there exists a nomadic science", "the bell tolls for thee", "days without cthulhu: -1", "they’re stars that are facing the end", "you do not recognize the bodies in the water", "i want to dance with devils on dead stars", "rebellion gets really easy when you make so many fucking rules", "the enemy doesn’t arrive by boat he arrives by limousine", "it would seem that a whole nomad science develops eccentrically, one that is very different from the royal or imperial sciences.", "those who own for a living rule those who work for a living", "there is water at the bottom of the ocean", "more confident, capable, farseeing, and prudent"]

const txt_height = 14
let text_font = txt_height + "px Verdana"
const off_img = "dot_2.png"
const on_img = "redDot_2.png"

function measureTextHeight(text, font) {
  canvas = document.getElementById("textCanvas");
  const ctx = canvas.getContext("2d");
  ctx.font = font;
  ctx.textBaseline = "bottom";
  let metric = ctx.measureText(text);
  ctx.textBaseline = "top";
  ctx.imageSmoothingEnabled = false;
  ctx.fillStyle = "rgb(200,10,10)";
  console.log(metric)
  let height = metric.actualBoundingBoxAscent - metric.actualBoundingBoxDescent 
  console.log("text height: ",height)
  height = Math.ceil(height)
  console.log("returned height: ", height)
  return height
}

// Use the function to measure the text height
var num_grid_rows = measureTextHeight(phrases[0], text_font) + 4;

let grid_text_spacing = 2; // horizontal spacing between letters
let startX = 0;

// async function flashbang(callingElement)
// {
//     callingElement.disabled = true;
//     await sleep(getRandomInt(15000))
//     let myModal = document.getElementById('myModal');
//     myModal.style.display = "block";
//     console.log(callingElement);   
//     var flash = new Audio('audio1.mp3');
//     audio.play();
//     audio.addEventListener('ended', (event) => {
//         callingElement.disabled = false;
//         myModal.style.display = "none";
//     });
// }
// function sleep(ms) {
//     return new Promise(resolve => setTimeout(resolve, ms));
//   }

function tick()
{
    runCanvasTick(pixelGrid);
    console.log("tick")
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
var num_grid_cols;
let gridItems = Array.from(Array(num_grid_rows), () => new Array());
function populateGrid(){
    let root = document.documentElement;
    toggled = true;
    console.log("populating");
    num_grid_cols = Math.trunc(((window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth)-20)/6);
    root.style.setProperty('--numCols', num_grid_cols);
    let grid = document.getElementById("gridContainer");
    console.log("cols: ",grid.getAttribute('grid-template-columns'));
    console.log("size: ", num_grid_cols)
    for(let i = 0; i < num_grid_rows; i++){
        for (let j = 0; j <num_grid_cols; j++) {
            var item = document.createElement("img");
            item.setAttribute("class", "pixel");
            // item.addEventListener("click", function() { togglePixel(item); });
            item.setAttribute("src",off_img);
            gridItems[i].push(item);
            grid.appendChild(item);
            toggled = !toggled
            if(toggled){togglePixel(item);}
        }
    }
    // console.log(grid)
}

function getColorIndicesForCoord(x, y, width) { //not relevant
    var red = y * (width * 4) + x * 4;
    return [red, red + 1, red + 2, red + 3];
  }


var slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
  showSlides(slideIndex += n);
}

function currentSlide(n) {
  showSlides(slideIndex = n);
}

function manageCanvas(){
    var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    canvas = document.getElementById("textCanvas");
    const ctx = canvas.getContext("2d");
    ctx.textBaseline = "top";
    ctx.fillStyle = "rgb(200,10,10)";
    console.log("width: ", width)
    ctx.font = text_font;
    ctx.fillText("Test", 100, 50);
    full_phrases = phrases.reduce((a,b) => a.concat(b))
    let canvDrawWidth = num_grid_cols + ctx.measureText(full_phrases).width + (full_phrases.length-1)*grid_text_spacing + phrases.length*num_grid_cols;
    canvDrawWidth = Math.ceil(canvDrawWidth) // should this be ceil or floor?
    console.log("canvDrawWidth: ",canvDrawWidth)

    ctx.imageSmoothingEnabled = false;
    height = ctx.canvas.height;
    ctx.canvas.width = canvDrawWidth;
    ctx.canvas.height = num_grid_rows;
    ctx.font = text_font;

    // draw something on the canvas
    // draw the text
      startX = num_grid_cols;
      for (const phrase of phrases){
        for (const letter of phrase){
          ctx.fillText(letter,startX,txt_height);
          ctx.font = text_font;
          startX += ctx.measureText(letter).width + grid_text_spacing;
        }
        startX += num_grid_cols;
      }
    // canvDrawWidth = startX;
    // ctx.canvas.width = canvDrawWidth;

      // draw a rectangle
        // ctx.fillStyle = 'black';
        // ctx.rect(0, 0, canvDrawWidth, num_grid_rows);
        // ctx.fill();

      // draw striped
        // let stripeWidth = 10; // Width of each stripe
        // let rectHeight = num_grid_rows; // Height of the rectangle
        // let rectWidth = canvDrawWidth; // Width of the rectangle
        // ctx.fillStyle = 'black';
        // for(let i = 0; i < rectWidth; i += stripeWidth * 2) {
        //     ctx.fillRect(i, 0, stripeWidth, rectHeight);
        // }

    // get the data from the canvas
    var data = Array.from(ctx.getImageData(0,0,canvDrawWidth,num_grid_rows).data);
    // console.log("image data sum: ",sum_matrix(data))
    console.log("data length mod canv width: ", data.length % canvDrawWidth)
    var pixels = [];
    count = 0;
    for(let i = 3; i < data.length; i += 4) //only looking at alpha
    {
        pixels.push(data[i])
        data[i] != 0 ? count += 1 : count += 0 //debugging purposes
    }
    console.log("count: ",count)
    console.log("pixels: ",pixels)
    console.log("pixel sum: ",sum_array(pixels))

    pixelGrid = []
    console.log("mod: ", pixels.length%canvDrawWidth)
    for(let i = 0; i < num_grid_rows; i ++)
    {
        pixelGrid.push(pixels.slice(i*canvDrawWidth,(i+1)*canvDrawWidth))
    }
    //pixel grid is a vector of rows indexible by [column, row]  //console.log("good pixels: ", nonEmpty)
    console.log("Pixels Grid: ", pixelGrid)

    setInterval(runCanvasTick,34,pixelGrid)
    // setInterval(runCanvasTick,17,pixelGrid) //roughly 60fps 
}

function setState(desiredState){ //take an array with row# of col#-length array, set the state of the grid to match
    //state is indexibile by [col,row], unfortunately

    let numCols = desiredState.length
    let num_grid_rows = desiredState[0].length

    let turnOn = []
    let turnOff = []
    for(let i = 0; i < numCols; i ++)
    {
        for(let j = 0; j < num_grid_rows; j ++)
        {
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

function sum_array(arr){
    return arr.reduce((a,b) => a+b,0)
}

function sum_matrix(m){
    return m.reduce((a,b) => a.concat(b)).reduce((a,b) => a+b)
}

let pointer = 0;
function runCanvasTick(pixelsGridData) //use a callback function on a timer to call it
{
    canvas = document.getElementById("textCanvas");
    const ctx = canvas.getContext("2d");
    // console.log("ticking")
    // console.log("gridItems in runCanvas: ",gridItems)
    // console.log(Array.isArray(gridItems[0]))
    let gridWidth = gridItems[0].length
    // console.log("gridWidth:", gridWidth)
    let width = pixelsGridData[0].length
    let height = pixelsGridData.length
    let state = Array.from(Array(num_grid_rows), () => new Array());

    for(let i = 0; i < height; i++)
    {
        ctx.beginPath();
        // console.log("pixelsGrid[",i,"] from ",pointer," to ",pointer+gridWidth,"(sum ",sum_array(pixelsGridData[i].slice(pointer,pointer+gridWidth)) ,"): ", pixelsGridData[i].slice(pointer,pointer+gridWidth))
        for(let j = 0; j < gridWidth; j++)
        {
            ctx.rect((j+pointer)%width, i, 1, 1);
            // console.log("i: ",i," j: ",j," pointer: ",pointer," width: ",width," height: ",height," gridWidth: ",gridWidth," pixelsGridData: ",pixelsGridData[i][(j+pointer)])
            state[i][j] = (pixelsGridData[i][(j+pointer)%width] == 0 ? 0 : 1)
           }
        ctx.stroke();
      }
      pointer++;

    setState(state)
}

function turnPixelsOff(pixels){
    // console.log("turnOff: ",pixels)
    for(let i =0; i < pixels.length; i ++)
    {
        turnPixelOff(pixels[i])
    }
}
function turnPixelsOn(pixels){
    // console.log("turnOn: ",pixels)
    for(let i =0; i < pixels.length; i ++)
    {
        turnPixelOn(pixels[i])
    }
}

function turnPixelOn(item){
    if(item.getAttribute("src") == on_img)
    {
        return;
    }
    togglePixel(item)
}

function turnPixelOff(item){
    if(item.getAttribute("src") != on_img)
    {
        return;
    }
    togglePixel(item)
}

function togglePixel(item){
    let isOn = item.getAttribute("src") == on_img
    isOn ? item.setAttribute("src",off_img) : item.setAttribute("src",on_img);
function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("slides");
  var dots = document.getElementsByClassName("dot");
  if (n > slides.length) {slideIndex = 1}
    if (n < 1) {slideIndex = slides.length}
    for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
    }
    for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
    }
  slides[slideIndex-1].style.display = "flex";
  dots[slideIndex-1].className += " active";
}


populateGrid()
manageCanvas()