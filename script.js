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
    console.log("populating")
    let grid = document.getElementById("gridContainer")
    for (let i = 0; i < 2500; i++) {
        let item = document.createElement("img");
        item.setAttribute("class", "pixel");
        item.addEventListener("click", togglePixel(item))
        item.setAttribute("src","dot.png");
        grid.appendChild(item);
    }
}
function togglePixel(item){
    console.log(item);
    item.setAttribute("src","redDot.png");
}