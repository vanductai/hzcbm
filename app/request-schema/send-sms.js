const Models = require('../models');
const WebhookModels = Models.WebhookModels.Webhook;
const SUPPORTED_TOPICS = WebhookModels.SUPPORTED_TOPICS;
const shared = require('./shared');
const stringNotEmpty = shared.stringNotEmpty;

exports.get = {
    validate: 'params',
    schema: {
        type: 'object',
        properties: {
            topic: {
                type: 'string',
                enum: Object.values(SUPPORTED_TOPICS),
            },
        },
    },
};