var discord = require('discord.io');
var auth = require('./auth.json');
var zmq = require('zmq');
var _channelID = '';

console.log('ictmon Discord bot started.');
console.log('Trying to connect...');

const socket = zmq.socket(`req`);
socket.connect(`tcp://localhost:5560`);
 
socket.on('message', function (tps) {
	console.log('Response received');
		var data = {
		  "to": _channelID,
		  "embed": {
			"color": 532392,
			"fields": [
			  {
				"name": "TPS (1 minute)",
				"value": `${tps}`,
				"inline": true
			  },
			]
		  }
	};
	bot.sendMessage(data);
});
 
function sendTpsRequest () {
	console.log('Sending tps request...');
	socket.send('tps');
}

var bot = new discord.Client({
   token: auth.token,
   autorun: true
});

bot.on('ready', function (evt) {
    console.log('Connected.');
	console.log('Logged in as: ' + bot.username + ' - (' + bot.id + ')');
});

bot.on('message', function (user, userID, channelID, message, evt) {
    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
       
        args = args.splice(1);
        switch(cmd) {
            case 'tps': {
				_channelID = channelID;
				sendTpsRequest();
				break;
			}
			case 'microhash': {
				bot.sendMessage({
					to: channelID,
					message: "Let's not talk about that night..."
				});
				break;
			}
			case 'cfb': {
				bot.sendMessage({
					to: channelID,
					message: "Yes?"
				});
				break;	
			}
         }
     }
});
