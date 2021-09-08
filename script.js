function flashbang(callingElement)
{
    let myModal = document.getElementById('myModal');
    myModal.style.display = "block";
    console.log(callingElement);
    callingElement.disabled = true;
    var flash = new Audio('audio1.mp3');
    audio.play();
    audio.addEventListener('ended', (event) => {
        callingElement.disabled = false;
        myModal.style.display = "none";
    });
}