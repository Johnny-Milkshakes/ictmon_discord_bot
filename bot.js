const util = require('util');
const Discord = require('discord.js');
const auth = require('./auth.json');
var zmq = require('zeromq')
  , sockPush = zmq.socket('push')
  , sockPull = zmq.socket('pull');

sockPush.connect('tcp://127.0.0.1:3000');
sockPull.bind('tcp://127.0.0.1:3000');

const bot = new Discord.Client();

const socketOnPromise = util.promisify(sockPull.on.bind(sockPull))

console.log('ictmon Discord bot started.');
console.log('Trying to connect...');
bot.on('ready', () => {
  console.log('I am ready!');
});

sendTpsRequest = async () => {
  console.log('Sending tps request...');
  sockPush.send('tps');
  try {
    const tps = await socketOnPromise('message');
    return tps;
  } catch (err) {
    console.log(err)
  }
}

bot.on('message', async message => {
  if (message.content.substring(0, 1) === '!') {
    const args = message.content.substring(1).split(' ');
    const cmd = args[0];

    switch (cmd) {
      case 'tps':
        const response = await sendTpsRequest();
        const embed = new Discord.RichEmbed()
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
