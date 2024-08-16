
document.addEventListener("DOMContentLoaded", async function () {
    // Function to fetch local JSON data
    async function fetchLocalData(url) {
        try {
            const response = await fetch(url);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }
    
    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
    }
    // Function to create and display game elements
    function displayGame(game, parent, noads) {
        const gameContainer = document.getElementById(parent);
        const gameDiv = document.createElement("div");
        gameDiv.classList.add("lgame");
        // gameDiv.classList.add("popupbtn")

        const gameName = document.createElement("h3");
        gameName.textContent = game.Name;

        const gameIcon = document.createElement("img");

        const gameCat = document.createElement("p");
        gameCat.textContent = game.category;
        gameCat.classList.add("lcat");

        const gameDescription = document.createElement("p");
        if (game.description !== '') {
            gameDescription.textContent = game.description
        } else {
            gameDescription.textContent = 'Theres no description for this game, sorry.'
        }


        const gameUrl = document.createElement("a");
        gameUrl.href = "playgame.html?id=" + game.id;


        gameDiv.appendChild(gameName);
        gameDiv.appendChild(gameCat);
        gameDiv.appendChild(gameIcon);
        gameDiv.title = game.Name + " | " + game.id
        if (~game.image) {
            gameIcon.src = game.image;
        } else {
            gameIcon.remove()
        }
        gameDiv.appendChild(gameDescription);



        gameUrl.appendChild(gameDiv);
        gameContainer.appendChild(gameUrl);

    }

    function createsublist(gamesData, num, title, keyword, sort) {
        const slistdiv = document.createElement("div")
        slistdiv.classList = 'sub-list'
        slistdiv.title = title
        const titleh3 = document.createElement("h3")
        titleh3.textContent = title
        slistdiv.append(titleh3)
        document.getElementById("sub-list").append(slistdiv)
        const Games = gamesData.filter(game => game.category === keyword);
        var sortedGames = {}
        if (sort !== 'new') {
            sortedGames = Games.sort((a, b) => a.id - b.id);
        } else {
            sortedGames = Games.sort((b, a) => a.id - b.id);
        }

        const lowestGames = sortedGames.slice(0, num);

        slistdiv.id = keyword
        lowestGames.forEach(game => {
            displayGame(game, keyword, true);
        });
        const moreGames = document.createElement("a")
        moreGames.textContent = ("more " + keyword + " games").toLowerCase()
        moreGames.href = '/game-list.html?sort=' + keyword;
        moreGames.className = 'findmorebtn'
        slistdiv.append(moreGames)

    }

    // Main function to fetch data and display games
    async function main() {
        const gamesData = await fetchLocalData("https://sobloxsy.com/games.json");
        const gameContainer = document.getElementById("game-list");
        createsublist(gamesData, 5, "Sports", "Sport", 'old')
        createsublist(gamesData, 5, "Action", "Action", 'old')
        createsublist(gamesData, 5, "Puzzles", "Puzzle", 'new')
        createsublist(gamesData, 5, "Platform", "Platformer", 'new')
        createsublist(gamesData, 5, "Racing", "Racing", 'new')
        createsublist(gamesData, 5, "Casual", "Casual", 'new')

        gamesData.sort((a, b) => b.id - a.id).forEach(game => {
            displayGame(game, "game-list");
        });

        const newgames = gamesData.sort((a, b) => b.id - a.id);
        const lowestFour = newgames.slice(0, 5);

        lowestFour.forEach(game => {
            displayGame(game, "newgames", true);
        });
        const moreGames = document.createElement("a")
        moreGames.textContent = ("more new games").toLowerCase()
        moreGames.href = '/game-list.html'
        moreGames.className = 'findmorebtn'
        document.getElementById("newgames").append(moreGames)




    }

    // Call the main function
    main();
});


