const config = require('../maindefs').config;
const checkLink = require('../maindefs').checkLink;
const getUrls = require('get-urls');
module.exports = message => {
  let urls = Array.from(getUrls(message.content));
  if (urls !== []) {
    urls.forEach(url => {
      let check = checkLink(url);
      if (check !== null) {
        message.delete();
        return message.channel.send(`${message.author.username}#${message.author.discriminator}'s message contained a link to an unsafe site and has been deleted. This offence has been logged`);
      }
    });
  }
  if (message.author.bot) return;
  let client = message.client;
  if (!message.content.startsWith(config.Bot.prefix)) return;
  let command = message.content.split(' ')[0].slice(config.Bot.prefix.length);
  let params = message.content.split(' ').slice(1);
  let perms = client.elevation(message);
  let cmd;
  if (client.commands.has(command)) {
    cmd = client.commands.get(command);
  } else if (client.aliases.has(command)) {
    cmd = client.commands.get(client.aliases.get(command));
  }
  if (cmd) {
    if (perms < cmd.conf.permLevel) return message.reply('You do not have permisson to do this!');
    cmd.run(client, message, params, perms);
  }

};