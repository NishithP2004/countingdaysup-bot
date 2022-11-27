// Twitter Bot - @Countingdaysup
// Author - Nishith P (@nishithp2004)

var Twit = require('twit');

const fetch = require('node-fetch');
/* const fetch = (...args) => import('node-fetch').then(({
    default: fetch
}) => fetch(...args)); */
require('dotenv').config();
const fs = require('fs');
/* const Instagram = require('instagram-web-api');
const FileCookieStore = require("tough-cookie-filestore2");
const Jimp = require('jimp'); */
const cron = require('node-cron');
const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Listening on port: ${port}`)
})

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html")
})

/* // Instagram API Configuration
const cookieStore = new FileCookieStore("./cookies.json");
const client = new Instagram({
    username: process.env.INSTA_USERNAME,
    password: process.env.INSTA_PASSWORD,
    cookieStore
}, {
    language: "en-US"
}) */


// Twitter API Configuration
var T = new Twit({
    consumer_key: process.env.KEY,
    consumer_secret: process.env.KEY_SECRET,
    access_token: process.env.TOKEN,
    access_token_secret: process.env.TOKEN_SECRET,
    timeout_ms: 60 * 1000, // optional HTTP request timeout to apply to all requests.
    strictSSL: true
})

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
    }, (err, tweet, response) => {
        if (err) {
            console.log(err)
        } else {
            console.log(tweet.id_str)
            // IGLoginFunc(tweet.id_str);
            /* setTimeout(() => {
                IGUploadPic(tweet.id_str);
            }, 30000) */
        }
    })
}

// Instagram Methods
/* async function getTweetImg(tweetId) {
    const obj = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            authorization: `${process.env.TWEETPIK_KEY}`
        },
        body: JSON.stringify({
            dimension: "1:1",
            tweetId: tweetId,
            displayVerified: true,
            displaySource: false,
            displayTime: true
        }),
        color: JSON.stringify({
            backgroundColor: "#000",
            textPrimaryColor: "#fff",
            textSecondaryColor: "#6E767D",
            verifiedIcon: "#fff"
        })
    }
    let baseUrl = ""
    await fetch('https://tweetpik.com/api/images', obj)
        .then(res => {
            baseUrl = `https://ik.imagekit.io/tweetpik/${process.env.BUCKET_ID}/${tweetId}.png`;
        })
        .catch(e => console.log(e))

    return baseUrl;
}

async function pngToJpeg(tweetId) {

    let url = await getTweetImg(tweetId)
        .then((res) => {
            Jimp.read(res)
                .then(img => {
                    return img
                        .quality(100) // set JPEG quality
                        .write('./images/tweet.jpg'); // save
                })
                .catch(err => {
                    console.error(err);
                }).catch(e => console.log(e))
        })
        .catch(e => console.log(e))


    await fetch(url)
        .then(res => {
            const dest = fs.createWriteStream(`./images/tweet.png`);
            res.body.pipe(dest)
        })
        .then(() => {
            Jimp.read('./images/tweet.png')
                .then(img => {
                    return img
                        .quality(100) // set JPEG quality
                        .write('./images/tweet.jpg'); // save
                })
                .catch(err => {
                    console.error(err);
                });
        })
        .catch(e => console.log(e)) 

}

const IGLoginFunc = async (tweetId) => {
    try {
        await client.login({
                username: process.env.INSTA_USERNAME,
                password: process.env.INSTA_PASSWORD
            })
            .then(() => console.log(`Logged in as ${process.env.INSTA_USERNAME}`))
            .then(() => {
                setTimeout(() => {
                    IGUploadPic(tweetId);
                }, 30000)
            })
    } catch (e) {
        if (e) {
            console.log("Login Failed !")
            console.log("Retrying in 120s !")

            setTimeout(() => {
                IGLoginFunc(tweetId);
            }, 1200000)
        }
    }
}

const IGUploadPic = async (tweetId) => {
    try {
        pngToJpeg(tweetId);
        // Rendering Time
        setTimeout(async () => {
            const photo = "./images/tweet.jpg"

            await client.uploadPhoto({
                photo,
                caption: "Quote for the day.",
                post: "feed"
            })
        }, 30000)
    } catch (e) {
        if (e) {
            console.log("Media Post Error !");
        } else {
            console.log("Tweet Successfully posted to IG");

            // Deleting Tweet Image from memory after use.
            fs.unlink("./images/tweet.jpg", e => {
                if (e) console.log(e)
            })
        }
    }

} */


// Scheduling Tweet at 08:45 am IST daily
cron.schedule("45 8 * * *", () => {
    // Tweet 
    tweetStart();
})