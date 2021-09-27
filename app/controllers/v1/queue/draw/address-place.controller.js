const { SettingModel, AddressModel } = require('../../../../models');
const { Constants, Logger, Helper } = require('../../../../common');
const { Enqueue } = require('../../../../rabbitmq');
const { AddressPlaceEnqueue } = Enqueue;
const request_promise = require('request-promise');
const { AddressDrawHelper } = require('../../../../helper');

module.exports = function (app) {
    const DrawAddressController = {
        /**
         * 
         * @param {*} req 
         * @param {*} res 
         * @param {*} next 
         */
        drawAddress: async function (req, res, next) {
            const setting = await SettingModel.Model.findOne({ _id: Constants.SETTING_ID.setting_address });
            if (setting == null || !setting.enable_draw) {
                Logger.consoleLogs('Setting disable');
                return res.send({ status: 0 });
            }

            var addresses = await AddressModel.Model.find({ count_place: null }).limit((setting.sequence_limit != null) ? setting.sequence_limit : 1);
            if (addresses.length == 0) {
                return res.send({ status: 0 });
            }
            await Helper.awaitTimeout((setting.delay_millisecond) ? setting.delay_millisecond : 2000);
            return Promise.all(addresses.map(address => {
                return AddressDrawHelper.drawOneAddress(address);
            })).then(updated_addresses => {
                DrawAddressController.nextDraw();
                return res.send({ status: 1, addresses: updated_addresses });
            }).catch(error => {
                Logger.error(`Get place error: ${error.toString()}`);
                DrawAddressController.nextDraw();
                return res.send({ status: 0 });
            });
        },
        nextDraw: function () {
            return AddressPlaceEnqueue.DrawAddressPlaceQueue.enqueueDrawAddressPlace();
        }
    };

    return DrawAddressController;
};