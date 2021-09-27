const Ajv = require('ajv');

exports.validate = function (req, schemas, allErrors = true) {
    const ajv = new Ajv({
        allErrors: allErrors,
        useDefaults : true,
    });

    const schema = schemas.schema;
    let data;
    switch (schemas.validate) {
        case 'params':
            data = req.params;
            break;
        case 'body':
            data = req.body;
            break;
        case 'query':
            data = req.query;
            break;
        default:
            break;
    }

    const isValid = ajv.validate(schema, data);

    return {
        isValid: isValid,
        errors: ajv.errors,
    }
};

exports.Webhook = require('./webhook');
exports.Core = require('./core');