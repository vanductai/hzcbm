const Telegraf = require('telegraf');
const TeleBotInst = require('.');
const CommandHandle = require('./command-handle')

/**
 * @param {Telegraf} teleBot
 */
module.exports = function (app, teleBot) {
    teleBot.command('help', async function (ctx) {
        ctx.reply('Hello');
        console.log('Reply help');
    });

    
    teleBot.command('/startdraw', async function (ctx) {
        CommandHandle.AddressHandle.DrawAddressHandle.startDrawAddress(ctx);
    });

    teleBot.command('/stopdraw', async function (ctx) {
        CommandHandle.AddressHandle.DrawAddressHandle.stopDrawAddress(ctx);
    });

    

    // On every text message
    teleBot.on('text', async function (ctx) {

    });

}

const deleteMessage = function (ctx) {
    var messageId = ctx.update.message.message_id;
    ctx.deleteMessage(messageId)
}
exports.deleteMessage = deleteMessage;
