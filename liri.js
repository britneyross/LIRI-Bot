require("dotenv").config();

var keys = require("./keys.js");

var Spotify = require("node-spotify-api");

var axios = require("axios");
var moment = require("moment");
var fs = require("fs");

var spotify = new Spotify(keys.spotify);

var userInput = process.argv[2];
var search = process.argv.slice(3).join("+");

if (userInput == "concert-this") {
    concertThis();
} else if (userInput == "spotify-this-song") {
    spotifyThis()
} else if (userInput == "movie-this") {
    movieThis();
} else if (userInput == "do-what-it-says") {
    doThis();
} else {
    console.log(`\n-----------------------------------------------------\n`)
    console.log(`\n   Try these commands: `)
    console.log(`\n   concert-this\n   spotify-this-song\n   movie-this\n   do-what-it-says\n  `)
    console.log(`\n-----------------------------------------------------`)
}

function spotifyThis() {

    //default 
    if (!search) {
        search = "modern+love"
    }

    spotify.search({ type: 'track', query: search }, function (err, response) {

        if (err) {
            return console.log('Error occurred: ' + err);
        }

        // displays 3 songs
        for (var i = 0; i < 3; i++) {
            var track = response.tracks.items[i];

            console.log(`\n-----------------------------------------------------\n`)
            console.log(`   Artist/Band: ${track.artists[0].name}`)
            console.log(`   Song: ${track.name}`)
            console.log(`   Preview Song: ${track.external_urls.spotify}`)
            console.log(`   Album: ${track.album.name}`)
        };
        console.log(`\n-----------------------------------------------------`)

    });
};

function concertThis() {

    // default
    if (!search) {
        search = "lady+gaga"
    }

    var queryUrl = "https://rest.bandsintown.com/artists/" + search + "/events?app_id=codingbootcamp";
    //console.log(queryUrl);

    axios.get(queryUrl).then(
        function (response) {

            //console.log(response.data)
            var concert = response.data;

            if (!concert.length) {
                console.log("No results found for " + search);
                return;
              }

            if (concert.length > 3) {
                for (var i = 0; i < 3; i++) {
                    console.log(`\n-----------------------------------------------------\n`)
                    console.log(`   Artist/Band: ${concert[i].lineup[0]}`)
                    console.log(`   Date: ${moment(concert[i].datetime).format("MM/DD/YYYY")}`)
                    console.log(`   Location: ${concert[i].venue.city}, ${concert[i].venue.region}`)
                    console.log(`   Venue: ${concert[i].venue.name}`)
                };
                console.log(`\n-----------------------------------------------------`)
            } else {
                for (var i = 0; i < concert.length; i++) {
                    console.log(`   Artist/Band: ${concert[i].lineup[0]}`)
                    console.log(`   Date: ${moment(concert[i].datetime).format("MM/DD/YYYY")}`)
                    console.log(`   Location: ${concert[i].venue.city}, ${concert[i].venue.region}`)
                    console.log(`   Venue: ${concert[i].venue.name}`)
                };
                console.log(`\n-----------------------------------------------------`)
            }
        }
    );
};

function movieThis() {

    //default 
    if (!search) {
        search = "pulp+fiction"
    }

    var queryUrl = "http://www.omdbapi.com/?t=" + search + "&y=&plot=short&apikey=trilogy";
    //console.log(queryUrl);

    axios.get(queryUrl)
        .then(function (response) {
            // console.log(response.data);
            var movie = response.data;

            console.log(`\n-----------------------------------------------------\n`)
            console.log(`   Title: ${movie.Title} `)
            console.log(`   Year: ${movie.Year} `)
            console.log(`   IMBD Rating: ${movie.Ratings[0].Value}`)
            console.log(`   Rotten Tomatoes Rating: ${movie.Ratings[1].Value}`)
            console.log(`   Country: ${movie.Country}`)
            console.log(`   Language: ${movie.Language}`)
            console.log(`   Plot: ${movie.Plot}`)
            console.log(`   Actors: ${movie.Actors}`)
            console.log(`\n-----------------------------------------------------`)
        })
        .catch(function (error) {
            console.log(error)
        });
};

//TODO: prevent default spotifyThis action

function doThis() {

    fs.readFile("random.txt", "utf8", function (error, response) {

        if (error) {
            return console.log(error);
        }
     
        var command = response.split(",");
        if (command[0] == "spotify-this-song"){
            spotifyThis(command[1]);
        }

    });
};
