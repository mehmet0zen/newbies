var votes = [];

function handleRadioButtonChange(selectedValue) {
    loadVoteData(selectedValue === "most_voted");
}

async function fetchCSV(url) {
    const response = await fetch(url);
    const text = await response.text();
    return text;
}

async function processData(csvText) {
    const lines = csvText.trim().split('\n');
    const header = lines.shift().split(',');
    
    const voteList = lines.map(line => {
        const values = line.split(',');
        const vote = {};
        header.forEach((key, index) => {
            vote[key.trim()] = values[index].replaceAll('"', "");
        });
        
        return vote;
    });
    voteList.forEach((vote) => {
        vote["Votes"] = countVote(voteList, vote["Idea"]);
    })
    return voteList;
}

function countVote(dict, idea) {
    var count = 0;
    dict.forEach(vote => {
        if (vote["Idea"] === idea) count++;
    });
    return count;
}

async function loadVoteData(sortedByMostVoted) {
    const radioButtons = document.querySelectorAll('input[type="radio"]');
    radioButtons.forEach(button => {
        button.addEventListener('change', function() {
        if (this.checked) {
            const selectedValue = this.value;
            handleRadioButtonChange(selectedValue);
        }
        });
    });
    try {
        const csvText = await fetchCSV('/data/votes.csv');
        votes = await processData(csvText);
        
        const voteList = document.getElementById('voteList');
        voteList.innerHTML = "";
        const newVotes = new Map();
        // Loop through the votes array to populate the uniqueIdeas map
        for (const vote of votes) {
            const idea = vote["Idea"];
            newVotes.set(idea, vote);
        }
        const deduplicatedVotes = [...newVotes.values()];
        if (sortedByMostVoted)
        deduplicatedVotes.sort((a, b) => parseInt(b["Votes"]) - parseInt(a["Votes"]));
        else { deduplicatedVotes.sort((a, b) => parseInt(b["Idea"].split(".")[0]) - parseInt(a["Idea"].split(".")[0])); deduplicatedVotes.reverse();}

        deduplicatedVotes.forEach(vote => {
            //const li = document.createElement('li');
            //console.log(Object.keys(vote));
            const itchUsername = vote["Itch"].trim();
            const idea = vote["Idea"].trim();
            const votesCount = vote["Votes"];
            const totalCount = votes.reduce((sum, v) => sum + v["Votes"], 0);
            const percentageValue = (votesCount / totalCount) * 100;
            var onClick = "";

            if (idea.includes("by"))
                onClick = `'${idea.split('by')[1].trim()}'`;
            else 
                onClick = "'kosmotion'";

            const percentage = document.createElement('span');
            percentage.className = 'percentage';
            percentage.textContent = `(${percentageValue.toFixed(2)}%)`;
            
            voteList.innerHTML += `<li><strong>${idea.split("by")[0]}</strong> <span class="author" onClick=locateToProfile(${onClick})>${("by " + onClick).replaceAll("'", "").replace("by kosmotion", "")}</span>: <span class="numOfPeople">${votesCount} PEOPLE VOTED</span> </li>`;
            voteList.children[voteList.children.length-1].appendChild(percentage);
        });
    } catch (error) {
        console.error('Error loading vote data:', error);
    }
}

function locateToProfile(itch) {
    window.open(`https://itch.io/search?q=${itch.replaceAll(" ", "+")}`, "_blank");
}

// Load vote data when the page is ready
window.addEventListener('DOMContentLoaded', loadVoteData(false));  