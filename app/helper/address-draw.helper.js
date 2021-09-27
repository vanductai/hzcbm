const request_promise = require('request-promise');
const { Logger } = require('../common');

/**
 * 
 * @param {*} address 
 * @returns 
 */
exports.drawOneAddress = async function (address) {
    const option = {
        uri: 'https://cbm.caybua.com/v1/mapapi/search',
        method: 'POST',
        json: true,
        body: {
            search_text: address.address,
            componentRestrictions: {
                country: 'vn'
            },
            radius: 1000
        }
    }
    Logger.consoleLogs(`Start get place of address: ${address.address}`);
    Logger.consoleLogs(JSON.stringify(option));
    return request_promise(option)
        .then(items => {
            var object_places = {};
            if (address.places) {
                address.places.forEach(element => {
                    object_places[element.place_id] = element;
                });
            }
            items.forEach(element => {
                object_places[element.place_id] = element;
            });
            address.places = Object.values(object_places);
            address.last_draw_at = new Date();
            address.count_place = Object.keys(object_places).length;
            Logger.consoleLogs(`Get success ${items.length} places`);
            return address.save();
        }).catch(error => {
            Logger.error(`Get place error: ${error.toString()}`);
            return null;
        });
}