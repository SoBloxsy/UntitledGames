
document.addEventListener("DOMContentLoaded", function () {
    // Function to fetch local JSON data
    if (!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get("id");
        document.location.href = '/playgame.html?id=' + urlParams.get("id")
    }

    async function fetchLocalData(url) {
        try {
            const response = await fetch(url);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    var gametype = null

    // Function to handle search parameter
    function handleSearchParams(data) {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get("id");

        if (id) {
            const matchingGame = data.find(game => game.id === parseInt(id));

            if (matchingGame) {
                document.title = matchingGame.Name + ' | Play on UntitledGames'

                const gameContainer = document.getElementById("mgame-container");
                const gameName = document.createElement("h2");
                gameName.textContent = matchingGame.Name;
                const gameDescription = document.createElement("p");
                if (matchingGame.maindescription) {
                    gameDescription.textContent = matchingGame.maindescription;
                }

                const gameUrl = document.createElement("iframe");
                gameUrl.src = matchingGame.url;
                gameUrl.classList = "mgame"
                gameUrl.id = 'game'
                gameUrl.oncontextmenu = "return false;"
                gameUrl.onerror = function () {
                    // Handle the error here
                    var errorMessage = gameUrl;
                    errorMessage.innerHTML = "Failed to connect to game (Your network might have blocked it, try using your hotspot)";

                };

                const fullscreenBtn = document.createElement("button")
                fullscreenBtn.textContent = "FULLSCREEN"
                fullscreenBtn.id = 'fullscreenButton'
                fullscreenBtn.classList.add("popupbtn")

                const shareBtn = document.createElement("button")
                shareBtn.textContent = "SHARE"
                shareBtn.id = 'shareButton'
                shareBtn.classList.add("popupbtn")


                const moreLikeA = document.createElement("a")
                const moreLikeBtn = document.createElement("button")
                gametype = matchingGame.category
                moreLikeBtn.textContent = (matchingGame.category + " GAMES").toUpperCase()
                moreLikeBtn.id = 'moreLikeButton'
                moreLikeBtn.classList.add("popupbtn")
                moreLikeA.href = '/game-list.html?sort=' + matchingGame.category

                shareBtn.addEventListener('click', function (event) {
                    var dummy = document.createElement('input'),
                        text = window.location.href;

                    document.body.appendChild(dummy);
                    dummy.value = text;
                    dummy.select();
                    document.execCommand('copy');
                    shareBtn.textContent = "COPIED TO CLIP"
                    setTimeout(() => {
                        shareBtn.textContent = "SHARE";
                    }, 1000);
                    document.body.removeChild(dummy);

                });

                gameContainer.appendChild(gameName);
                gameContainer.appendChild(gameUrl);

                bottombar.appendChild(fullscreenBtn);
                bottombar.appendChild(shareBtn);
                moreLikeA.appendChild(moreLikeBtn);
                bottombar.appendChild(moreLikeA);
                gameContainer.appendChild(bottombar);


                fullscreenBtn.addEventListener("click", () => {
                    if (!document.fullscreenElement) {
                        gameUrl.requestFullscreen().catch(err => {
                            console.error("Error attempting to enable full-screen mode:", err);
                        });
                    } else {
                        document.exitFullscreen();
                    }
                });

                bottombar.appendChild(gameDescription);


            } else {
                console.log("No game found with the specified ID.");
                window.location.href = "/"
            }
        } else {
            window.location.href = "/"
        }
    }

    // Function to find similar titles
    function getSimilarTitles(currentTitle, allTitles) {
        const similarTitles = [];
        const similarityThreshold = 0.5;

        for (const titleInfo of allTitles) {
            const similarityRatio = stringSimilarity(currentTitle, titleInfo.Name); // Checking similarity with 'Name' property

            if (similarityRatio > similarityThreshold) {
                similarTitles.push({ "title": titleInfo.Name, "id": titleInfo.id });
            }
        }

        return similarTitles;
    }


    // Function to calculate string similarity (you can use more advanced methods if needed)
    function stringSimilarity(a, b) {
        const aLower = a.toLowerCase();
        const bLower = b.toLowerCase();
        const maxLength = Math.max(aLower.length, bLower.length);
        const editDistance = levenshteinDistance(aLower, bLower);
        return 1 - editDistance / maxLength;
    }

    // Function to calculate Levenshtein distance (string edit distance)
    function levenshteinDistance(a, b) {
        const dp = Array.from(Array(a.length + 1), () => Array(b.length + 1).fill(0));
        for (let i = 0; i <= a.length; i++) {
            for (let j = 0; j <= b.length; j++) {
                if (i === 0) dp[i][j] = j;
                else if (j === 0) dp[i][j] = i;
                else if (a[i - 1] === b[j - 1]) dp[i][j] = dp[i - 1][j - 1];
                else dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
            }
        }
        return dp[a.length][b.length];
    }

    // Function to display similar game suggestions
    function displaySimilarSuggestions(currentGameName, gameData) {
        const similarTitles = getSimilarTitles(currentGameName, gameData);

        if (similarTitles.length > 0) {
            var suggames = 0
            const suggestionsContainer = document.createElement("div");
            suggestionsContainer.classList = "suggestions";

            if (suggames < 10) {
                console.log(suggames)
                const newgameData = gameData.filter(game => game.category === gametype);
                const nsortedGames = newgameData.sort((a, b) => a.id - b.id);
                nsortedGames.forEach(game => {
                    if (game.Name !== document.querySelector("h2").textContent) {
                        const suggestionItem = document.createElement("p");
                        const suglink = document.createElement("a")
                        const sugdiv = document.createElement("div")
                        const sugimg = document.createElement("img")
                        sugimg.src = game.image
                        sugdiv.classList = "popupbtn"
                        suggestionItem.textContent = game.Name;
                        suglink.href = "playgame.html?id=" + game.id;
                        sugdiv.appendChild(suggestionItem);
                        sugdiv.appendChild(sugimg);
                        suglink.appendChild(sugdiv);
                        suggestionsContainer.appendChild(suglink);
                        suggames = suggames + 1
                    }
                });

            }
            // Append the suggestions container to the gameContainer or any appropriate location
            const gameContainer = document.getElementById("suggestions");
            gameContainer.appendChild(suggestionsContainer)
        }
    }

    // Main function to fetch data and handle search parameter
    async function main() {
        const gamesData = await fetchLocalData("https://sobloxsy.com/games.json");
        handleSearchParams(gamesData);

        // Get the current game's name
        const currentGameName = document.querySelector("h2").textContent; // Assuming you're using h2 for the game name

        // Display similar suggestions
        displaySimilarSuggestions(currentGameName, gamesData);
    }

    // Call the main function
    main();

});


