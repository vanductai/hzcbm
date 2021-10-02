const { Constants, Helper } = require('../../../common');
const TeleBotInst = require('../..');
const { SettingModel, AddressModel } = require('../../../models');
const { Enqueue } = require('../../../rabbitmq');
const { AddressPlaceEnqueue } = Enqueue;


/**
 * /startdraw
 */
exports.startDrawAddress = async function (ctx) {
    var { message, message_id, user_id } = TeleBotInst.getInfoTeleContext(ctx);

    if (!Constants.TELE_ADMIN_ID.includes(user_id)) {
        return ctx.reply('Bạn éo có quyền dùng comand này!');
    }
    var update_obj = {
        _id: Constants.SETTING_ID.setting_address,
        enable_draw: true
    };
    const messages = message.split(' ');
    if (messages.length == 2) {
        if (!isNaN(messages[1])) {
            update_obj.sequence_limit = messages[1];
        }
    }

    if (messages.length == 3) {
        if (!isNaN(messages[2])) {
            update_obj.delay_millisecond = messages[2];
        }
    }
    await SettingModel.Model.findOneAndUpdate({ _id: Constants.SETTING_ID.setting_address }, { $set: update_obj }, { new: true, upsert: true });
    AddressPlaceEnqueue.DrawAddressPlaceQueue.enqueueDrawAddressPlace();
    ctx.reply('Success');
}

/**
 * /stopdraw
 */
exports.stopDrawAddress = async function (ctx) {
    var { message, message_id, user_id } = TeleBotInst.getInfoTeleContext(ctx);

    if (!Constants.TELE_ADMIN_ID.includes(user_id)) {
        return ctx.reply('Bạn éo có quyền dùng comand này!');
    }

    await SettingModel.Model.findOneAndUpdate({ _id: Constants.SETTING_ID.setting_address }, { _id: Constants.SETTING_ID.setting_address, enable_draw: false }, { new: true, upsert: true });
    return ctx.reply('Complete');
}

/**
 * /cda
 */
exports.countDraw = async function (ctx) {
    var { message, message_id, user_id } = TeleBotInst.getInfoTeleContext(ctx);

    if (!Constants.TELE_ADMIN_ID.includes(user_id)) {
        return ctx.reply('Bạn éo có quyền dùng comand này!');
    }

    const count = await AddressModel.Model.countDocuments({ count_place: { $ne: null } });
    return ctx.reply(`Total: ${count}`);
}