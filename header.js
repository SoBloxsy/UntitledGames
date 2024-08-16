var announce = ""
var announceImg = ""

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function showDivUnderButton(buttonId, divId) {
    const button = document.getElementById(buttonId);
    const div = document.getElementById(divId);

    let isHovering = false;

    button.addEventListener('mouseover', () => {
        const buttonRect = button.getBoundingClientRect();
        const buttonTop = buttonRect.top + buttonRect.height;
        const buttonLeft = buttonRect.left;

        div.style.position = 'absolute';
        div.style.top = `${buttonTop}px`;
        div.style.left = `${buttonLeft}px`;

        div.style.display = 'flex';

        isHovering = true;
    });

    div.addEventListener('mouseover', () => {
        isHovering = true;
    });

    div.addEventListener('mouseout', () => {
        isHovering = false;

        // Hide the div only if the mouse is not over the button or the div
        setTimeout(() => {
            if (!isHovering) {
                div.style.display = 'none';
            }
        }, 100);
    });

    button.addEventListener('mouseout', () => {
        isHovering = false;

        // Hide the div only if the mouse is not over the button or the div
        setTimeout(() => {
            if (!isHovering) {
                div.style.display = 'none';
            }
        }, 100);
    });
}


const header = document.getElementById("header");
header.innerHTML = `
<a href="/" class="logo">
<img class="logo" src="socoolgames.png" alt="Logo" title="SoCoolGames Home">
</a>
<div class="GAMES">
<a href='game-list.html'><button class="popupbtn">Games List</button></a>
<button class="popupbtn" id="cat">Catergories</button>
<button onclick="window.location.href = 'playgame.html?id=' + getRandomInt(0,103)" class="popupbtn">Random
    Game</button>

<a href='https://forms.gle/2bMLPnYcRjbKDey18'><button class="popupbtn">Submit Game</button></a>
<input class="popupbtn" id="search" placeholder="Search">
</div>
<div id="catlist" class="hsub" style="display: none"></div>
    `;

const style = document.createElement("style")
style.innerHTML = `<style>
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@600&family=Paytone+One&family=Roboto&display=swap');
</style>`
document.head.appendChild(style)

document.getElementById('search').addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        document.location.href = '/game-list.html?search=' + document.getElementById('search').value
    }
});

const ads = document.createElement("div")
ads.innerHTML = `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5751343033961763"
     crossorigin="anonymous"></script>`
document.head.append(ads)
{/* <button class="popupbtn" >Catergories</button> */ }


var Catergories = [
    { "name": 'Action' }, { "name": 'Sport' }, { "name": 'Puzzle' }, { "name": 'Platformer' }, { "name": 'Casual' }, { "name": 'Simulation' }, { "name": 'Idle' }, { "name": 'Strategy' }, { "name": 'Music' }
]
showDivUnderButton('cat', 'catlist');

Catergories.forEach(game => {
    const cate = document.createElement('a')
    cate.href = '/game-list.html?sort=' + game.name
    cate.textContent = (game.name).toUpperCase()
    cate.style.display = 'inline'
    document.getElementById('catlist').appendChild(cate)
})

const footer = document.getElementById("footer");
footer.innerHTML = `

<div class="GAMES">
<a href='game-list.html'><button class="popupbtn">Games List</button></a>
<button onclick="window.location.href = 'playgame.html?id=' + getRandomInt(0,103)" class="popupbtn">Random
    Game</button>
<a href='https://forms.gle/2bMLPnYcRjbKDey18'><button class="popupbtn">Submit Game</button></a>
</div>
<a href="/" class="logo">
<img class="logo" src="socoolgames.png" alt="Logo" title="UntitledGames Home">
</a>

    `;

function closeBanner() {
    document.getElementById('banner').style.display = 'none';
}
document.getElementById('banner').addEventListener('click', function (event) {
    closeBanner()
})
// Function to show the banner
function showBanner() {
    document.getElementById('banner').style.display = 'block';
}

if (announce !== "") {
    showBanner();
    const bannerElement = document.getElementById('banner');
    bannerElement.textContent = announce;

    if (announceImg !== "") {
        const img = document.createElement('img');
        img.src = announceImg;  // Set the image source
        img.style.width = '30px';
        bannerElement.appendChild(img);  // Append the image to the banner
    }
}
