let refresherId;
let initialCount;
let initialWins;
let initialLosses;
let initialDraws;
let winStreak = 0;
let bestStreak = 0;
let winsTemp;
let drawsTemp;
let lossesTemp;
let player;
let mode;
let apiUrl;

function getGamesPlayed() {
    fetch(apiUrl, {
        headers: {
            'Accept': 'application/x-ndjson'
        }
    })
        .then(response => response.json())
        .then(data => {
            initialCount = data.stat["count"].all;
            initialWins = data.stat["count"].win;
            initialDraws = data.stat["count"].draw;
            initialLosses = data.stat["count"].loss;
            winsTemp = initialWins;
            drawsTemp = initialDraws;
            lossesTemp = initialDraws;
        })
        .catch(error => {
            console.error('Smth fkd up:', error);
        });
}

function updateGamesPlayed() {
    fetch(apiUrl, {
        headers: {
            'Accept': 'application/x-ndjson'
        }
    })
        .then(response => response.json())
        .then(data => {
            let gamesPlayed = data.stat["count"].all;
            let wins = data.stat["count"].win;
            let draws = data.stat["count"].draw;
            let losses = data.stat["count"].loss;
            console.log(winsTemp, wins)
            if (wins > winsTemp) {
                winStreak += 1;
                winsTemp = wins;
                if (winStreak > bestStreak) {
                    bestStreak = winStreak;
                }
            }
            else if (losses > lossesTemp || draws > drawsTemp) {
                winStreak = 0;
                lossesTemp = losses;
                drawsTemp = draws;
            }
            document.getElementById('total').innerText = `${gamesPlayed - initialCount}`;
            document.getElementById('wins').innerText = `${wins - initialWins}`;
            document.getElementById('draws').innerText = `${draws - initialDraws}`;
            document.getElementById('losses').innerText = `${losses - initialLosses}`;
            document.getElementById('win-streak').innerText = `${winStreak}`;
            document.getElementById('best-win-streak').innerText = `${bestStreak}`;
        })
        .catch(error => {
            console.error('Smth fkd up:', error);
            document.getElementById('gamesPlayed').innerText = 'ERRRROR!!!!';
        });
}

function resetApiUrl() {
    apiUrl = `https://lichess.org/api/user/${player}/perf/${mode}`
}

function refreshData() {
    updateGamesPlayed();
    refresherId = setTimeout(refreshData, 1000);
}

function stopRefreshing() {
    document.getElementById("inputs").classList.remove("hidden");
    document.getElementById("controls").classList.add("hidden");
    document.getElementById("stats").classList.add("hidden");
    document.getElementById("message").innerText = '';
    document.getElementById("mode").innerText = 'Mode...';
    winStreak = 0;
    bestStreak = 0;
    clearTimeout(refresherId);
}

function processInputData() {
    player = document.getElementById("player").value;
    mode = document.getElementById("mode_input").value;
    document.getElementById('mode').innerText = `${mode}`;
    resetApiUrl();
    getGamesPlayed();
    updateGamesPlayed();
    refreshData();
    document.getElementById("stats").classList.remove("hidden");
    document.getElementById("inputs").classList.add("hidden");
    document.getElementById("controls").classList.remove("hidden");
}