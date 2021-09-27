const restify = require('restify');
const common = require('../../../common');
const Constants = common.Constants;
const { AddressController } = require('../../../controllers').v1.QueueController;

module.exports.route = function (app) {
    app.post('/queue/draw/address-place', restify.plugins.conditionalHandler([{
        version: Constants.API_VERSION_NAME,
        handler: [
            AddressController(app).drawAddress
        ]
    }]));


};