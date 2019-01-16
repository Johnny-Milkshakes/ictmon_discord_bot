const util = require('util');
const { Client, RichEmbed } = require('discord.js');
const auth = require('./auth.json');
const zmq = require('zmq');
const socket = zmq.socket(`req`);

socket.connect(`tcp://localhost:5560`);
const bot = new Client();

const socketOnPromise = util.promisify(socket.on);

console.log('ictmon Discord bot started.');
console.log('Trying to connect...');
bot.on('ready', () => {
  console.log('I am ready!');
});

sendTpsRequest = async () => {
	console.log('Sending tps request...');
	socket.send('tps');
	
	const tps = await socketOnPromise('message');
	return tps;
}

bot.on('message', async message => {

  if (message.substring(0, 1) === '!') {
    const args = message.substring(1).split(' ');
    const cmd = args[0];

    switch (cmd) {
      case 'tps':
				const response = await sendTpsRequest();
				const embed = new RichEmbed()
				.setTitle('TPS (1 minute)')
				.setColor(0xFF0000)
				.setDescription(`${response}`);
        message.channel.send(embed);
        break;

      case 'microhash':
        message.channel.send("Let's not talk about that night...");
        break;

      case 'cfb' :
        message.channel.send("Yes?");
        break;
    }
  }
});

bot.login(auth.token);
