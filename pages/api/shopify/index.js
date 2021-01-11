var jwt = require('jsonwebtoken');
const shops = require('../../../db/shops');
const getBulkData = require('../../../helpers/getBulkData');
const processData = require('../../../helpers/processData.js');
const Path = require('path');
const fs = require('fs');

/**
 * @description Gets called when the user submites the tempalate
 * @URI /api/shopify/
 */
export default async function templateForm(req, res) {
    return new Promise((resolve, reject) => {
        /**
         * Verify token and see if the current store on the cookies is the real store
         * we have on the databse
         */
        const undecodedToken = req.cookies['x-auth-token'];
        const shopOrigin = req.cookies['shopOrigin'];
        const templateValue = req.body.templateValue;

        if (!undecodedToken || !shopOrigin || !templateValue) {
            throw new Error('No token, authorization denied.');
        }

        const decoded = jwt.verify(undecodedToken, process.env.JWT_SECRET);

        shops
            .findShopByName(shopOrigin)
            .then((data) => {
                if (
                    data &&
                    decoded &&
                    data.shop_origin &&
                    decoded.shop_origin &&
                    data.access_token &&
                    decoded.access_token
                ) {
                    if (data.shop_origin == decoded.shop_origin && data.access_token == decoded.access_token) {
                        getBulkData
                            .getBulkData(decoded.shop_origin, decoded.access_token)
                            .then((jsonFile) => {
                                processData
                                    .process(
                                        decoded.shop_origin,
                                        decoded.access_token,
                                        jsonFile,
                                        templateValue
                                    ) /** Proccess the bulk Data here */
                                    .then((data) => {
                                        /**
                                         * too many promises Let's make one last promise
                                         *
                                         */

                                        resolve();
                                    })
                                    .catch((err) => {
                                        reject('Erro on index:processBulkData.readfile.catch: ' + err);
                                    });
                            })
                            .catch((err) => {
                                reject('Error while index.js.getBulkData.catch: ' + err);
                            });
                    } else {
                        throw new Error('cookies auth error 1');
                    }
                } else {
                    throw new Error('Cookie auth error 2');
                }
            })
            .catch((err) => {
                console.log('FindShop Error: ', err.message);
                reject('Error while finding and matching shop');
            });
    }).catch((err) => {
        res.status(401).json({ msg: 'Auth Error, Please re-authenticate!' });
        console.log('> Something went wrong ', err.message ? err.message : err);
    });
}
