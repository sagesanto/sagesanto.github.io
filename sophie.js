const container = document.querySelector('.ground');
const numElements = 100; // Number of <i> elements to create

// store references so we can restart animations later
const elems = [];
let valentines = []

const MEAN_DURATION = 5;
const DURATION_STD = 20;

function drawGaussian(mean, stdDev) {
    return Math.sqrt(-2 * Math.log(1 - Math.random())) * Math.cos(2 * Math.PI * Math.random()) * stdDev + mean;
}

async function fetchValentines() {
    const requestURL = "sophie_res/valentines.json";
    const request = new Request(requestURL);

    const response = await fetch(request);
    const data = await response.json();
    valentines = data.messages;
    return valentines;
}

fetchValentines().then(valentines => { do_setup(valentines); }).catch(error => {
    console.error('Error fetching valentines:', error);
});

function create_clickable_valentine() {
    const elem = document.createElement('c');
    const image_inside = document.createElement('img');
    image_inside.src = 'sophie_res/clickable_heart.png';
    elem.style.position = 'absolute';
    
    const randomTop = Math.random() * 90 + 100; 
    const randomLeft = Math.random() * 90 + 100;
    elem.style.top = randomTop + '%';
    elem.style.left = randomLeft + '%';

    var animation_duration = drawGaussian(20, 10);
    while (animation_duration < 10 || animation_duration > 40) {
        animation_duration = drawGaussian(MEAN_DURATION, DURATION_STD);
    }
    elem.style.animationDuration = animation_duration + 's';
    elem.appendChild(image_inside);
    elem.addEventListener('click', onClick);
    return elem;
}

function create_background_element() {
    const element = document.createElement('i');
    const image_inside = document.createElement('img');
    image_inside.src = 'sophie_res/white_heart.png';
    element.style.position = 'absolute';
    

    var animation_duration = drawGaussian(MEAN_DURATION, DURATION_STD);
    while (animation_duration < 1 || animation_duration > 100) {
        animation_duration = drawGaussian(MEAN_DURATION, DURATION_STD);
    }
    element.style.animationDuration = animation_duration + 's';
    
    const mean_size = 20;
    const size_std = 10;
    var size = drawGaussian(mean_size, size_std);
    while (size < 10 || size > 40) {
        size = drawGaussian(mean_size, size_std);
    }
    image_inside.style.height = size + 'px';
    image_inside.style.width = size + 'px';

    const opacity_mean = 0.6;
    const opacity_std = 0.1;
    var opacity = drawGaussian(opacity_mean, opacity_std);
    while (opacity < 0 || opacity > 1) {
        opacity = drawGaussian(opacity_mean, opacity_std);
    }
    image_inside.style.opacity = opacity;

    
    // generate random positions within container
    const randomTop = Math.random() * 100 + 100; 
    const randomLeft = Math.random() * 100 + 100;
    element.style.top = randomTop + '%';
    element.style.left = randomLeft + '%';
    element.appendChild(image_inside);
    return element;
}

function do_setup(valentines) {
    if (container) {
        const ground_pos = container.getBoundingClientRect();
        ground_x = ground_pos.left + ground_pos.width / 2;
        ground_y = ground_pos.top + ground_pos.height / 2;
        
        for (let i = 0; i < valentines.length; i++) {
            const element = create_clickable_valentine();
            elems.push(element);
            container.appendChild(element);
        }
        for (let i = 0; i < numElements; i++) {
            const element = create_background_element();
            container.appendChild(element);
            elems.push(element);
        }
        elems.forEach(e => {
            const elem_pos = e.getBoundingClientRect();
            const elem_center_x = elem_pos.left + elem_pos.width / 2;
            const elem_center_y = elem_pos.top + elem_pos.height / 2;

            // rotate the background elements so that when they orbit they always face inwards
            dx = ground_x - elem_center_x;
            dy = ground_y - elem_center_y;
            angle = Math.atan2(dy, dx) * (180 / Math.PI);
            image = e.querySelector('img');
            if (image) {
                image.style.transform = `rotate(${-(90-angle)}deg)`;
            }

            e.style.transformOrigin = `${ground_x - elem_center_x}px ${ground_y - elem_center_y}px`;
        })
    }
}

function onClick(event) {
    if (document.getElementById('card')) {
        return; // if a card is already open, ignore clicks
    }
    const element = event.target;
    element.style.animationPlayState = 'paused'; 
    element.style.visibility = 'hidden'; 
    v = valentines.pop();
    if (!v) {
        return;
    }
    event.stopPropagation();
    create_text_card(v);
}

function all_done() {
    const ground = document.querySelector('.ground');
    ground.style.borderRadius = '0';
    ground.style.backgroundImage = 'url("sophie_res/final_image.jpg")';
    ground.style.backgroundSize = 'cover';
    const title = document.getElementById('title');
    title.textContent = "Happy Valentine's Day <3"
}

function close_card() {
    const box = document.getElementById('card');
    box.remove();
    if (valentines.length === 0) {
        all_done();
    }
}

function create_text_card(text){
    document.getElementById('card')?.remove();
    const x = document.createElement('x');
    const card = document.createElement('div');
    card.setAttribute("id", "card");
    card.className = 'card';
    const text_elem = document.createElement('p');
    text_elem.textContent = text;
    text_elem.style.fontSize = '32px';
    text_elem.style.textAlign = 'center';
    card.appendChild(text_elem);
    x.addEventListener('click', close_card);
    card.appendChild(x);
    document.body.appendChild(card);
}

function create_image_card(image_url,caption){
    document.getElementById('card')?.remove();

    const card = document.createElement('div');
    card.setAttribute("id", "card");
    card.className = 'card';
    const img = document.createElement('img');
    img.src = image_url;
    const caption_elem = document.createElement('p');
    caption_elem.textContent = caption;
    card.appendChild(img);
    card.appendChild(caption_elem);
    document.body.appendChild(card);
}

function randomizePosition(event) {
    const element = event.target;
    const randomTop = Math.random() * 100+100; 
    const randomLeft = Math.random() * 100+100; 
    element.style.top = randomTop + '%';
    element.style.left = randomLeft + '%';
    const elem_pos = element.getBoundingClientRect();
    element.style.transformOrigin = `${ground_x - elem_pos.left}px ${ground_y - elem_pos.top}px`;
}