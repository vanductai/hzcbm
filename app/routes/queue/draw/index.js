exports.AddressPlaceRoute = require('./address-place.route');

exports.route = function (app) {
    exports.AddressPlaceRoute.route(app);
}