const express = require('express');
const fs = require('fs');
const router = express.Router();
const colors = require('colors');
const { debug, api } = require('./../config.json');
const winston = require('winston');
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
router.use('/tebex/webhook', function (req, res, next) {
    if (req.path === '/tebex/webhook/favicon.ico') return res.redirect(api.favicon_url);
    var ip = req.socket.remoteAddress;
    // Update log
    logger.info('Request received from: ' + ip)
    if (debug) { console.log(`${colors.gray(`Debug enabled, cached IP || from: ${ip}`)}`); }

    if (ip === '::ffff:172.18.0.1' || ip === '54.87.231.232') { next(); } // you should change this to your networks internal IP (remember to filter webhooks or validate its from tebex before accepting forwarding from internal ips)
    else {
        console.log(colors.red(`Bad Request from: ${ip}`));
        return res.status(403).jsonp({ error: 'Not authorized' });
    }
});

module.exports = router;

