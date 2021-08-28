// Twitter Bot - @Countingdaysup
// Author - Nishith P (@nishithp2004)

var Twit = require('twit');
const fetch = require('node-fetch');
require('dotenv').config();

// Twitter API Configuration
var T = new Twit({
    consumer_key: process.env.KEY,
    consumer_secret: process.env.KEY_SECRET,
    access_token: process.env.TOKEN,
    access_token_secret: process.env.TOKEN_SECRET,
    timeout_ms: 60 * 1000, // optional HTTP request timeout to apply to all requests.
    strictSSL: true
})

var d = new Date();

// Twitter Bot Initialised on Jan 1st 2021 0300 UTC hours || 08:30 IST
/* if (d.getFullYear() >= 2021 && d.getUTCHours() === 6) {
    tweetStart();
} */

tweetStart();
// Setting Interval for Function repetition
setInterval(tweetStart, 60 * 60 * 24 * 1000);

async function tweetStart() {
    let date = new Date();
    const response = await fetch('https://api.quotable.io/random')
    let dayData = await fetch("http://worldtimeapi.org/api/timezone/Asia/Kolkata")
          .then(res => res.json())
    let day = dayData['day_of_year'];
    const data = await response.json()
    const arr = date.toUTCString().slice(0).split(/ +/);
    const dateString = arr.splice(0, arr.length - 2).join(" ");
    var tweet = `Day ${day} \nDate: ${dateString} \n\n${data.content} —${data.author} \nHave a great Day!!`;

    T.post('statuses/update', {
        status: tweet
    }, tweetCallback());

    function tweetCallback(data, err, response) {
        if (err) {
            console.log(err);
        } else {
            console.log(`Day ${day} success !!`);
        }
    }
}
