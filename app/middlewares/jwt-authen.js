const restify = require('restify');
const requestIp = require('request-ip');
const error = require('../common/errors')
const Constants = require('../common/constants');
const Utilities = require('../common/utilities');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/user/user');

/**
 * Verify jwt token header
 * Order object must have enought required field
 * have valid field format
 * send a response with error message
 * call next() otherwise
 * 
 * @param {restify.Request} req 
 * @param {restify.Response} res 
 */
exports.isValidJwt = function (req, res, next) {
    const clientIp = Utilities.getRemoteIp(req);
    if (Utilities.localhostRangeIp().includes(clientIp.replace('::ffff:', ''))) {
        req.direct = true;
        return next();
    } else {
        req.direct = false
    }
    let token = req.query.__jwtAuthorization || req.headers['authorization'];
    // decode token
    if (token) {
        // verifies secret and checks exp
        jwt.verify(token, Constants.JWT_SECRET, async function (err, decoded) {
            if (err) {
                return res.send(
                    401,
                    error.responseError(100, [{ field: 'authorization', code: 1007 }])
                );
            } else {
                var decodeUser = decoded.data;
                // console.log(`Decode data: ${JSON.stringify(decodeUser)}`);
                var userCheck = await UserModel.findOne({ userName: decodeUser.userName });
                if (userCheck == undefined) {
                    return res.send(
                        401,
                        error.responseError(100, [{ field: 'username', code: 1006 }])
                    );
                }

                if (userCheck.lastLogin != decodeUser.lastLogin || userCheck.currentJwt != token) {
                    console.log('Token from client:' + token);
                    console.log('Token from backend:' + userCheck.currentJwt);
                    return res.send(
                        401,
                        error.responseError(100, [{ field: 'authorization', code: 1007 }])
                    );
                }
                // if everything is good, save to request for use in other routes
                // console.log('decodeUser:', decodeUser);
                req.me = decodeUser;
                req.me.jwt = token;
                req.userProfile = userCheck;

                if (!Utilities.containsString(req.url, '/updateSendedSMS')
                    && !Utilities.containsString(req.url, '/startSyncGSheet')
                    && !Utilities.containsString(req.url, '/updateKeepAlive')
                    && !Utilities.containsString(req.url, '/getPhoneList')
                    && !Utilities.containsString(req.url, '/updateSmsMode')) {
                    // console.log(`${userCheck.userName} - JWT: ${token}`);
                }

                next();
            }
        });
    } else {
        return res.send(
            401,
            error.responseError(100, [{ field: 'authorization', code: 1007 }])
        );
    }
}