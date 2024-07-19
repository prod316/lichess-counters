let refresherId;
let initialCount;
let player;
let mode;
let apiUrl;

const puzzles = ['streak', 'storm', 'racer']

function getGamesPlayed() {
    fetch(apiUrl, {
        headers: {
            'Accept': 'application/x-ndjson'
        }
    })
        .then(response => response.json())
        .then(data => {
            if (puzzles.includes(mode))
                initialCount = data.perfs[mode].runs;
            else
                initialCount = data.stat["count"].all;
            document.getElementById("message").innerText = `data was loaded - initial count is ${initialCount}`
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
            let gamesPlayed;
            if (puzzles.includes(mode))
                gamesPlayed = data.perfs[mode].runs;
            else
                gamesPlayed = data.stat["count"].all;
            document.getElementById('gamesPlayed').innerText = `${gamesPlayed - initialCount}`;
        })
        .catch(error => {
            console.error('Smth fkd up:', error);
            document.getElementById('gamesPlayed').innerText = 'ERRRROR!!!!';
        });
}

function resetApiUrl() {
    if (puzzles.includes(mode))
        apiUrl = `https://lichess.org/api/user/${player}`
    else
        apiUrl = `https://lichess.org/api/user/${player}/perf/${mode}`
}

function refreshData() {
    updateGamesPlayed();
    refresherId = setTimeout(refreshData, 1000);
}

function stopRefreshing() {
    document.getElementById("inputs").classList.remove("hidden");
    document.getElementById("message").innerText = '';
    document.getElementById("mode").innerText = 'Mode...';
    document.getElementById("gamesPlayed").innerText = 'loading...';
    clearTimeout(refresherId);
}

function processInputData() {
    player = document.getElementById("player").value;
    mode = document.getElementById("mode_input").value;
    document.getElementById('mode').innerText = `${mode}`;
    resetApiUrl();
    getGamesPlayed();
    updateGamesPlayed();
    document.getElementById("inputs").classList.add("hidden");
}