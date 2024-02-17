const fs = require('fs');
var colors = require('colors');
const winston = require('winston');
const { debug, shopchannelID2, defPort, embed, token, shopchannelID, language, useMCskin } = require("./config.json");
const type_req = require('./handlers/type_request.js');
const validfrom = require('./handlers/from.js');
const { autoTranslate } = require('./functions/translate.js');
const { createFeatures } = require('./functions/create_features.js');
// logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.simple()
  ),
  transports: [
    new winston.transports.File({ filename: 'app.log', level: 'info' }),
    new winston.transports.Console()
  ]
});

if (embed.useMCskin === undefined) createFeatures();
var emojititle = embed.emojititle; var emojireact = embed.emojireact;
var emojicurrency = embed.emojicurrency; var gifurl = embed.gifurl;
var url = embed.url; var url_infooter = embed.url_infooter;
var color = embed.color; var emojiproductArrow = embed.emojiproductArrow;

var conf;
const ll = require('./lib/check.js');
ll.cc(debug, defPort, emojititle, emojireact, emojicurrency, token, shopchannelID, language, gifurl, url, url_infooter);
const express = require('express');
var status = 0;
if (fs.existsSync('./langs/' + language + '.json')) {
  console.log(`${colors.cyan(`language loaded: ${language}`)}`);
  conf = require('./langs/' + language + '.json');
} else { autoTranslate(require('./lang/english.json'), language); status = 1; } //replace english.json with your prefered language file. See /lang/{...}


const {
  Client,
  Events, // might not be needed
  GatewayIntentBits,
  EmbedBuilder,
} = require("discord.js");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});


if (debug == true) {
  console.log(colors.gray('Debug mode is enabled!'));
  client.on('messageCreate', message => {
    if (message.author.bot) return;
    console.log(`${message.author.username}: ${message.content}`)
  });
}


// embed const
const { sendWH } = require('./functions/sendWH.js');
//const { setInterval } = require('timers/promises');


// cord
client.on('ready', () => {
  console.log(colors.yellow('2. Started... '));
  console.log(colors.green(`3. Logged in as ${client.user.tag}!`));
  console.log(colors.yellow('4. Running on ') + colors.green('discord.js v' + require('./package.json').dependencies['discord.js'].replace('^', '')));
  const app = express();
  const port = process.env.PORT || defPort;
  app.use(express.json(), type_req, validfrom);
  app.use(express.urlencoded({ extended: true }));

  app.post('/tebex/webhook', async function (req, res) { // process request change post('/') to match your values.
    try {
      const products = req.body.subject.products;
      const temp = products.map((product) => `${emojiproductArrow}${product.name} **x${product.quantity}** **|** $${product.paid_price.amount.toFixed(2)}`).join('\n');
      const totalPrice = `${req.body.subject.price.amount.toFixed(2)} **${req.body.subject.price.currency}** ${emojicurrency}`;
      const channel = client.channels.cache.get(shopchannelID);
      if (debug == true) console.log(`${conf.messages.getchannel} ${channel}`);
      var name = req.body.subject.customer.username.username;
      var prodl = products.length;
      if (!useMCskin) gifurl = 'https://mc-heads.net/avatar/' + name;
      await sendWH(prodl, name, temp, totalPrice, channel, url, url_infooter, color, emojititle, emojireact, gifurl, conf, EmbedBuilder);

// status 200 response tebexify -> Tebex
      res.status(200).json(req.body);
    } catch (err) {
      console.log(colors.red(`ERROR: ${err}`));
      await logger.info('server-error.log', `${err}\r\n`);
    }
  });

  app.listen(port);
  console.log(`${colors.yellow('5. Running on ')} ${colors.green('server port ' + port)}`);
  logger.info('App has started - Awaiting Payloads');
});
if (status == 0) { client.login(token); } else { console.log(colors.red('Reconfiguring language files, Tebexify is initiating an automatic reboot.')); }
