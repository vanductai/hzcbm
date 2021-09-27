const crypto = require('crypto');
const Constants = require('./constants');
const requestIp = require('request-ip');
const moment = require('moment-timezone');
const uuid = require('uuid');
const mongoose = require('mongoose');

/**
 * Build basic authenticate string by base64 encode username 
 * and password
 * 
 * @param {string} username
 * @param {string} password
 * 
 * @returns {string} basic auth string
 */
exports.generateBasicAuthString = function (username, password) {
    const auth = `${username}:${password}`;
    const buff = new Buffer.from(auth);
    const base64Auth = buff.toString('base64');
    return `Basic ${base64Auth}`;
};


/**
 * Helper function to encrypt the secret key
 *
 * @param {string} password key used by algorithm
 * @param {string} secret encrypted string
 * @param {string} algorithm used to encrypt secret
 */
function encryptSecret(password, secret, algorithm = 'aes256') {
    const cipher = crypto.createCipher(algorithm, password);
    return cipher.update(secret, 'utf8', 'hex') + cipher.final('hex');
};
exports.encryptSecret = encryptSecret;


/**
 * Helper function to decrypt the encrypted secret key
 *
 * @param {string} password key used by algorithm
 * @param {string} encryptedSecret decrypted string
 * @param {string} algorithm used to decrypt the encrypted secret
 */
function decryptSecret(password, encryptedSecret, algorithm = 'aes256') {
    const decipher = crypto.createDecipher(algorithm, password);
    return decipher.update(encryptedSecret, 'hex', 'utf8') + decipher.final('utf8');
};
exports.decryptSecret = decryptSecret;


function ignoreCaseRegex(value) {
    return { $regex: `^${value}$`, $options: 'i' };
}

exports.ignoreCaseRegex = ignoreCaseRegex;

function getDateFormat(timestamp, format, withoutTZ = false) {
    if (withoutTZ) {
        return moment(timestamp).format(format);
    } else {
        return moment(timestamp).tz(Constants.SERVER_TIMEZONE).format(format);
    }

}
exports.getDateFormat = getDateFormat;
/**
 * 
 * @param {*} timeDelay 
 * @param {*} delayType 
 */
function getScheduleTime(timeDelay, delayType) {
    var timeSchedule = Date.now();
    if (delayType == Constants.SECONDS) {
        timeSchedule += timeDelay * 1000;
    } else if (delayType == Constants.MINUTES) {
        timeSchedule += timeDelay * 1000 * 60;
    } else if (delayType == Constants.HOURS) {
        timeSchedule += timeDelay * 1000 * 60 * 60;
    } else if (delayType == Constants.DAYS) {
        timeSchedule += timeDelay * Constants.ONE_DAY_MILISECOND;
    } else if (delayType == Constants.WEEKS) {
        timeSchedule += timeDelay * Constants.ONE_DAY_MILISECOND * 7;
    } else if (delayType == Constants.MONTHS) {
        timeSchedule += timeDelay * Constants.ONE_DAY_MILISECOND * 7 * 30;
    } else if (delayType == Constants.YEARS) {
        timeSchedule += timeDelay * Constants.ONE_DAY_MILISECOND * 7 * 30 * 365;
    }
    return timeSchedule;
}
exports.getScheduleTime = getScheduleTime;

function deleteMongooField(objectMongoo, fieldDelete = []) {
    if (objectMongoo == undefined) {
        return objectMongoo;
    }
    var fieldToDel = fieldDelete.concat(['__v', '_id'])
    var newObject = objectMongoo;
    newObject = JSON.stringify(newObject);
    newObject = JSON.parse(newObject);

    for (var index = 0; index < fieldToDel.length; index++) {
        delete newObject[fieldToDel[index]];
    }

    for (var key in newObject) {
        if (newObject.hasOwnProperty(key)) {
            if (typeof (newObject[key]) == 'object') {
                newObject[key] = this.deleteMongooField(newObject[key], fieldDelete);
            }
        }
    }
    return newObject;
}
exports.deleteMongooField = deleteMongooField;


/**
* 
* @param {*} req 
*/
function getRemoteIp(req) {
    var headers = req.headers;
    if (headers['x-real-ip']) {
        return headers['x-real-ip'];
    }
    return requestIp.getClientIp(req);
}
exports.getRemoteIp = getRemoteIp;

function localhostRangeIp() {
    var ips = [];
    var os = require('os');
    var ifaces = os.networkInterfaces();

    Object.keys(ifaces).forEach(function (ifname) {
        var alias = 0;

        ifaces[ifname].forEach(function (iface) {
            ips.push(iface.address);
            ips.push(`${iface.address.substr(0, iface.address.length - 1)}1`);
            ++alias;
        });
    });
    return ips;
}
exports.localhostRangeIp = localhostRangeIp;


function getUuid() {
    return uuid.v4();
}
exports.getUuid = getUuid;

function generateObjectID() {
    return mongoose.Types.ObjectId()
}
exports.generateObjectID = generateObjectID;

exports.getValueInArray = function (arr = [], key, value) {
    var valueFound = undefined, indexFound = -1;
    for (var index = 0; index < arr.length; index++) {
        if (arr[index][key] == value) {
            valueFound = arr[index];
            indexFound = index;
        }
    }
    return [valueFound, indexFound];
}

exports.splitArray = function (listParent, limitLength = 100) {
    var listItemChilds = [];
    for (var index = 0; index < listParent.length; index++) {
        var item = listParent[index];
        if (item != undefined) {
            if (listItemChilds.length == 0) {
                listItemChilds.push([item]);
            } else {
                if (listItemChilds[listItemChilds.length - 1].length == limitLength) {
                    listItemChilds.push([item]);
                } else {
                    listItemChilds[listItemChilds.length - 1].push(item);
                }
            }
        }
    }

    return listItemChilds;
}

exports.awaitTimeout = function (timeDown) {
    return new Promise(res => setTimeout(res, timeDown))

}

exports.checkDuplicate = function (arrayObj = [], fieldName = 'id') {
    var objects = {};
    var listDup = []
    for (var index = 0; index < arrayObj.length; index++) {
        var valueOfName = arrayObj[index][fieldName];
        if (objects[valueOfName]) {
            listDup.push(arrayObj[index][fieldName]);
            // console.log(`Duplicate object: ${objects[valueOfName]}`);
        }
        objects[valueOfName] = arrayObj[index];
    }

    return listDup;
}

exports.isJsonValid = function (json) {
    try {
        if (JSON.parse(JSON.stringify(json))) {
            return json;
        } else {
            return undefined;
        }
    } catch (e) {
        return undefined;
    }
}

exports.isEmpty = function (obj) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

exports.randomInt = function (low, high) {
    return Math.floor(Math.random() * (high - low) + low)
}
