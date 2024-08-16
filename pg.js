document.addEventListener("DOMContentLoaded", function () {

    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get("id");
        document.location.href = '/mplaygame.html?id=' + urlParams.get("id")
    }

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

    var gametype = null

    function createbtn(name, id, icon, timeout) {
        const Btn = document.createElement("button");
        Btn.textContent = name;
        Btn.id = id;
        Btn.classList.add("popupbtn");
        Btn.title = name;

        const ges4 = document.createElement('span');
        ges4.classList.add('material-symbols-outlined');
        ges4.textContent = icon;
        Btn.appendChild(ges4);
        bottombar.appendChild(Btn);

        if (timeout) {
            Btn.disabled = true
            let timeLeft = timeout;
            const timerInterval = setInterval(() => {
                timeLeft--;
                if (timeLeft <= 0) {
                    clearInterval(timerInterval);
                    Btn.disabled = false; // Enable the button
                    Btn.textContent = name; // Reset the button text
                    Btn.appendChild(ges4);
                } else {
                    Btn.textContent = `${name} (${timeLeft}s)`; // Update button text
                    Btn.appendChild(ges4);
                }
            }, 1000);
        }

    }

    var on = false

    function theater() {
        if (on === false) {
            on = true
            var bounding = document.getElementById('bounding');
            bounding.classList.add("theater");
            var sidebar = document.getElementById('sidebar');
            var topbar = document.getElementById('header')
            var gamec = document.getElementById('game-container')
            localStorage.setItem('tempEle', document.getElementById('game-container').style.cssText)
            // var gc = document.getElementById('game-container');
            // gc.classList.add("theater");
            document.getElementById('game-container').style = "width: calc(100% + 16px) !important"
            sidebar.style.position = 'absolute';  // or 'relative', depending on your layout
            sidebar.style.top = (topbar.getBoundingClientRect().height + game.getBoundingClientRect().height + 225) + 'px';
            console.log(topbar.getBoundingClientRect().height + game.getBoundingClientRect().height)
        } else {
            var bounding = document.getElementById('bounding');
            bounding.classList.remove("theater");
            var sidebar = document.getElementById('sidebar');
            sidebar.style.top =''
            document.getElementById('game-container').style = localStorage.getItem('tempEle')
            on = false
        }

    }


    // Function to handle search parameter
    function handleSearchParams(data) {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get("id");

        if (id) {
            const matchingGame = data.find(game => game.id === parseInt(id));

            if (matchingGame) {
                document.title = matchingGame.Name + ' | Play on UntitledGames'
                var metaTag = document.querySelector('meta[name="description"]');
                metaTag.setAttribute('content', matchingGame.description);
                var ogImageTag = document.querySelector('meta[property="og:image"]');
                ogImageTag.setAttribute('content', matchingGame.image);

                const gameContainer = document.getElementById("game-container");
                const gameName = document.createElement("h2");
                gameName.textContent = matchingGame.Name;
                const gameDescription = document.createElement("p");
                if (matchingGame.maindescription) {
                    gameDescription.textContent = matchingGame.maindescription;
                } else if (matchingGame.description) {
                    gameDescription.textContent = matchingGame.description
                }

                const gameFrame = document.createElement("iframe");
                gameFrame.src = matchingGame.url;
                gameFrame.classList = "game"
                gameFrame.id = 'game'
                gameFrame.oncontextmenu = "return false;"
                gameFrame.onerror = function () {
                    // Handle the error here
                    var errorMessage = gameFrame;
                    errorMessage.innerHTML = "Failed to connect to game (Your network might have blocked it, try using your hotspot)";

                };

                if (matchingGame.width) {
                    gameContainer.style = "width:" + matchingGame.width + ' !important; '
                }
                if (matchingGame.height) {
                    gameFrame.style = "height:" + matchingGame.height + ' !important'
                }
                // if (matchingGame.scale) {
                //     gameFrame.style.transform = 'scale(0.75)'
                //     // gameFrame.style.height = (matchingGame.height + (matchingGame.height * 0.75))
                // }

                const moreLikeA = document.createElement("a")
                const moreLikeBtn = document.createElement("button")
                gametype = matchingGame.category
                moreLikeBtn.textContent = matchingGame.category + " Games"
                moreLikeBtn.id = 'moreLikeButton'
                moreLikeBtn.classList.add("popupbtn")
                moreLikeA.href = '/game-list.html?sort=' + matchingGame.category

                document.getElementById('yalc').textContent = `You'll Also Like These ` + matchingGame.category + " Games"

                const ymt5 = document.createElement('span');
                ymt5.classList.add('material-symbols-outlined');
                ymt5.textContent = 'more_horiz';
                moreLikeBtn.appendChild(ymt5);

                gameContainer.appendChild(gameFrame);
                bottombar.appendChild(gameName);
                createbtn('Like', 'likwbtn', 'thumb_up')
                // createbtn('Dislike', 'dislikebtn', 'thumb_down')
                createbtn('Big Picture', 'fullscreenButton', 'fullscreen')
                createbtn('Theater', 'theaterButton', 'open_in_full', 0)
                createbtn('Share', 'shareButton', 'share')
                createbtn('New Tab', 'moreLikeButton', 'add_to_photos', 45)

                moreLikeA.appendChild(moreLikeBtn);
                bottombar.appendChild(moreLikeA);
                gameContainer.appendChild(bottombar);
                bottombar.appendChild(gameDescription);

                fullscreenButton.addEventListener("click", () => {
                    if (!document.fullscreenElement) {
                        gameFrame.requestFullscreen().catch(err => {
                            console.error("Error attempting to enable full-screen mode:", err);
                        });
                    } else {
                        document.exitFullscreen();
                    }
                });

                shareButton.addEventListener('click', function (event) {
                    var dummy = document.createElement('input'),
                        text = window.location.href;

                    document.body.appendChild(dummy);
                    dummy.value = text;
                    dummy.select();
                    document.execCommand('copy');
                    shareButton.textContent = "Copied"
                    setTimeout(() => {
                        shareButton.textContent = "Share";
                    }, 1000);
                    document.body.removeChild(dummy);

                });

                document.getElementById('moreLikeButton').addEventListener('click', function (event) {
                    // window.open(('/game-list.html?sort=' + matchingGame.category), '_blank');
                    // Open a new tab/window
                    var newWindow = window.open();

                    // Wait for the new window to finish loading
                    newWindow.addEventListener('load', function () {
                        // Create a new iframe element
                        var iframe = document.createElement('iframe');

                        // Set iframe properties
                        iframe.src = 'about:blank';  // Load a blank page
                        iframe.width = '100%';
                        iframe.height = '100%';
                        iframe.src = matchingGame.url
                        iframe.style.border = 0

                        var wm = document.createElement('img');
                        wm.src = 'https://socoolgames.sobloxsy.com/socoolgames.png'
                        wm.style.border = 0
                        wm.style.width = '140px';
                        wm.style.position = 'fixed';
                        wm.style.bottom = '0px';
                        wm.style.right = '0px';
                        wm.style.zIndex = 3;

                        // Append the iframe to the new window's document body
                        newWindow.document.body.appendChild(iframe);
                        newWindow.document.body.appendChild(wm);
                        newWindow.document.body.style.margin = 0
                        newWindow.document.title = 'New Tab'
                    });

                })

                document.getElementById('theaterButton').addEventListener('click', function (event) {
                    // document.getElementById('theaterbox').append(gameFrame)
                    // document.getElementById('theaterbox').style.display = "block"

                    theater()
                })

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



            // similarTitles.forEach(title => {
            //     if (title.title !== document.querySelector("h2").textContent) {
            //         const suggestionItem = document.createElement("li");
            //         const suglink = document.createElement("a")
            //         suggestionItem.textContent = title.title;
            //         suglink.href = "playgame.html?id=" + title.id;
            //         suglink.appendChild(suggestionItem);
            //         suggestionsList.appendChild(suglink);
            //         suggames = suggames + 1
            //     }

            // });


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

    // if (window.innerWidth >= 1300) {
    //     document.getElementById('adbound').style.display = 'block';
    // } else document.getElementById('adbound').remove()

    // window.addEventListener('scroll', function () {

    //     var adbound = document.getElementById('sidebar');
    //     if (adbound) {
    //         const buttonRect = document.getElementById('bounding').getBoundingClientRect();
    //         adbound.style.display = 'block';
    //         adbound.style.top = (buttonRect.bottom) + 'px';
    //         console.log(buttonRect.y)
    //     }

    // });

    // window.addEventListener('resize', function () {
    //     var adbound = document.getElementById('adbound');
    //     if (adbound) {
    //         const buttonRect = document.getElementById('game-container').getBoundingClientRect();
    //         adbound.style.display = 'block';
    //         adbound.style.top = (buttonRect.top) + 'px';
    //         adbound.style.left = (buttonRect.left + buttonRect.width + 16) + 'px';
    //     }

    // });

});


