
const errors = require('restify-errors');

module.exports = function (options, app) {
    options = options || {};

    options.prefix = options.prefix || '';

    return function (req, res, next) {
        req.originalUrl = req.url;
        if (req.url == '/v1' || req.url.substr(0, 3) != '/v1') {
            return next(new errors.InvalidVersionError('Endpoint string is required'));
        }

        // console.log(req.url);

        req.url = req.url.replace(options.prefix, '');

        var pieces = req.url.replace(/^\/+/, '').split('/');
        var version = pieces[0];

        version = version.replace(/v(\d{1})\.(\d{1})\.(\d{1})/, '$1.$2.$3');
        version = version.replace(/v(\d{1})\.(\d{1})/, '$1.$2.0');
        var versionCheck = version;
        version = version.replace(/v(\d{1})/, '$1.0.0');

        if (['v1'].includes(versionCheck.toLowerCase())) {
            req.url = req.url.substr(pieces[0].length + 1);
            req.headers = req.headers || [];
            req.headers['accept-version'] = version;
        } else {
            return next(new errors.InvalidVersionError('This is an invalid version'));
        }
        res.charSet('utf-8')
        next();
    };
};
