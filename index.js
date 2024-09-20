
document.addEventListener("DOMContentLoaded", async function () {
    // Function to fetch local JSON data
    async function fetchLocalData(url) {
        const cacheKey = 'cachedData';
        const timestampKey = 'cacheTimestamp';
        const cacheDuration = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    
        try {
            // Get cached data and timestamp from localStorage
            const cachedData = localStorage.getItem(cacheKey);
            const cachedTimestamp = localStorage.getItem(timestampKey);
    
            // Check if we have cached data and if it's still valid
            if (cachedData && cachedTimestamp) {
                const now = Date.now();
                const lastFetchTime = parseInt(cachedTimestamp, 10);
    
                // If data is less than 24 hours old, return cached data
                if (now - lastFetchTime < cacheDuration) {
                    return JSON.parse(cachedData);
                }
            }
    
            // If no valid cache, fetch new data
            const response = await fetch(url);
            const data = await response.json();
    
            // Save new data and timestamp to localStorage
            localStorage.setItem(cacheKey, JSON.stringify(data));
            localStorage.setItem(timestampKey, Date.now().toString());
    
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
        const gamesData = await fetchLocalData("https://script.googleusercontent.com/macros/echo?user_content_key=vwz6k2hqZY2CVIU_GyJT6z36RSoVPHZhIaGw83q3rsjF1r3IuczTcqYXiRM-vip3nU835vN-HiCF-MUdAylT8mOWtxcp4OXYm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnP4oTBkrYnOVpvCvFHS6XYrt-tYrxo2qU6Iz6hOUeMcU-qRFxC5817RWVzqpbUZY2kZ7tyPnKUJbL5IC8n-3ssj-hdkqF3hnjNz9Jw9Md8uu&lib=Mfr2crV_BTVAM9TvuTZLv2c8bqkVDedAD");
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


