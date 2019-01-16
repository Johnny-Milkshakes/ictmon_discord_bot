const util = require('util');
const Discord = require('discord.js');
const auth = require('./auth.json');
var zmq = require('zeromq')
  , socket = zmq.socket('push');

socket.bind('tcp://127.0.0.1:5560');
const bot = new Discord.Client();

const socketOnPromise = util.promisify(socket.on.bind(socket))

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
  console.log(message.content.substring(0,1))
  if (message.content.substring(0, 1) === '!') {
    console.log("made it here!")
    const args = message.content.substring(1).split(' ');
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
