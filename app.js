const Discord = require('discord.js');
var http = require('http');
const request = require('request');

// change your info here!
const discordToken = 'Your Discord Token'
const client = new Discord.Client();
var chipotleChannel;
// put your channel you want to listen and send to here.
const channelID = 'Your Channel ID';

// this is what will trigger our bot
const botPrefix = 'c!';

// bot is ready
client.on('ready', () => {
    chipotleChannel = client.channels.get(channelID);
    chipotleChannel.send('Chipotle bot started. Check pinned! :burrito:');
});

// we got a message!
client.on('message', message => {
    // normal checks to not listen to ourselves
    if (message.channel.id != channelID) return;
    if (message.author.bot) return;
    // splits at spaces
    const messageArray = message.content.split(' ');
    // some users did not use spaces so we have to tell them and delete their messages.
    if (message.content.startsWith(botPrefix) && messageArray.length === 1){
        message.delete();
        message.reply('You need spaces in your message!')
        return;
    }
    // other cases where they're sending one word
    if (messageArray.length === 1){
        message.delete();
        message.reply('Try again!');
        return;
    }
    // NOTE: we want to protect user privacy so we delete their message as soon as we get it!

    // we have to check if they used the bot prefix.
    if (messageArray[0].toLowerCase() != botPrefix){
        message.delete();
        // don't forget to change your bot prefix in here
        message.reply('Try again. Check pinned or use `c! help`');
        return;
    };
    // we only want one line
    if (message.content.indexOf("\n") !== -1) {
        message.delete();
        message.reply('Please keep your message on one line!');
        return;
    };

    try{
        // help if they ask for it
        if (messageArray[1].toLowerCase() == 'help') {
            message.reply('Type `c! <first name> <last name> <phone number with +1 in the front> <zipcode>`');
            return;
        };}
    catch (err){
        message.reply('Something is up! :(')
    }

    // checks for a message length mismatch.
    if (messageArray.length < 5) {
        message.delete();
        message.reply('Invalid argument count!');;
        return    
    };

    // checks if phone number doesnt begin with +1
    if (!messageArray[3].startsWith('+1')){
        message.delete();
        message.reply('You need the +1 before your phone number!');
    }

    // modify with your info
    var userInfo = {
        'firstName': messageArray[1],
        'lastName': messageArray[2],
        'phoneNumber': messageArray[3],
        'optedIn': false,
        'zip': messageArray[4]
    }

    // promo url, may be able to change in the future
    const promoUrl = 'https://savorwavs.com/api/offer/request'

    // headers, again, you may be able to change this in the future
    const headers = {
        'Accept': 'application/json',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'en-US,en;q=0.8',
        'Connection': 'keep-alive',
        'Content-Type': 'application/json',
        'Host': 'savorwavs.com',
        'Origin': 'https://savorwavs.com',
        'Referer': 'https://savorwavs.com/buy-one-get-one',
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/55.0.2883.87 Chrome/55.0.2883.87 Safari/537.36'
    };

    // get your coupon, ayee
    request({
        url: promoUrl,
        method: 'POST',
        json: true,
        body: userInfo
    }, function(error, response, body) {
        if (response['body']['data'] == undefined){
            message.delete();
            message.reply(JSON.stringify(response['body']));
        } else {
            message.delete();
            message.reply('Success! Check your texts!');
        }
    });

});

// start our bot!
client.login(discordToken);

