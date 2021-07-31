// Twitter Bot - @Countingdaysup
// Author - Nishith P (@nishithp2004)

var Twit = require('twit');
const fetch = require('node-fetch');
//const db = require('quick.db');
const log = require('./log.json');
const fs = require('fs');
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

var daysOfYear, counter = log["daysWorked"],
    d = new Date();

// Twitter Bot Initialised on Jan 1st 2021 0300 UTC hours || 08:30 IST
if (d.getFullYear >= 2021 && d.getUTCHours() === 3) {
    tweetStart();
}
// Setting Interval for Function repetition
setInterval(tweetStart, 60 * 60 * 24 * 1000);

async function tweetStart() {
    let date = new Date();
    const response = await fetch('https://api.quotable.io/random')
    const data = await response.json()
    const arr = date.toUTCString().slice(0).split(/ +/);
    const dateString = arr.splice(0, arr.length - 2).join(" ");
    var tweet = `Day ${counter} \nDate: ${dateString} \n\n${data.content} —${data.author} \nHave a great Day!!`;

    var counterVerify = log["daysWorked"];

    if (counterVerify !== counter) {
        counter = counterVerify;
    }

    T.post('statuses/update', {
        status: tweet
    }, tweetCallback());

    ++counter;
    log["daysWorked"] = counter;
    fs.writeFileSync('./log.json', JSON.stringify(log), null, 2), (err) => {
        if (err) console.log(err);
    }

    // Verifying whether Leap year or not
    if (date.getFullYear() % 4 === 0) {
        daysOfYear = 366;

    } else {
        daysOfYear = 365;
    }

    // Resetting counter value after a year
    if (counter === daysOfYear) {
        counter = 1;
        log["daysWorked"] = counter;
        fs.writeFileSync('./log.json', JSON.stringify(log), null, 2), (err) => {
            if (err) console.log(err);
        }
    }

    function tweetCallback(data, err, response) {
        if (err) {
            console.log(err);
        } else {
            console.log(`Day ${counter - 1} success !!`);
        }
    }
}