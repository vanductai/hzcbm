const Telegraf = require('telegraf');
const BotCommand = require('./bot-command');
/**
 * @param {Telegraf} teleBot
 */
exports.init = function (app) {
    var botToken = process.env.BOT_TOKEN;
    console.log(`Bot token: ${botToken}`);
    if (!botToken || botToken == '') {
        console.log(`Bot token null`);
        return;
    }
    const teleBot = new Telegraf(botToken);
    teleBot.start((ctx) => {
        console.log(ctx.chat.id)
        ctx.reply('Hello, My name Tính Đẹp Trai...')
    });
    BotCommand(app, teleBot);
    teleBot.startPolling()
    exports.teleBot = teleBot;
    console.log('Init bot success');
}

exports.getInfoTeleContext = function (ctx) {
    return {
        chat_id: ctx.update.message.chat.id,
        user_id: ctx.update.message.from.id,
        username: ctx.update.message.from.username,
        message: ctx.update.message.text,
        message_id: ctx.update.message.message_id,
    }
}