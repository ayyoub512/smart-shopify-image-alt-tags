const Path = require('path');
const fs = require('fs');
var jwt = require('jsonwebtoken');
const shops = require('../../../db/shops');

const getBulkData = require('../../../helpers/getBulkData');
const processData = require('../../../helpers/processData');

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
                    if (data.shop_origin == decoded.shop_origin && data.access_token !== decoded.access_token) {
                        const shop = data.shop_origin;
                        const access_token = data.access_token;

                        /***
                         * this is a greate place to return something back to the user.
                         * If the request made it here meaning everything thats required from the user has been fulfilled,
                         * all left is for us to process the request.
                         *
                         */

                        res.json({ msg: 'The server has received your rquest and is processing it!', error: false });

                        getBulkData
                            .initBulkRequest(shop, access_token)
                            .then(() => {
                                return getBulkData.bulkStatusQuery(shop, access_token);
                            })
                            .then((jsonlURL) => {
                                return getBulkData.downloadJSONL(jsonlURL);
                            })
                            .then((jsonlFilePath) => {
                                return processData.processFile(jsonlFilePath);
                            })
                            .then((resultsArray) => {
                                resolve();
                            })
                            .catch((err) => {
                                console.error('ERROR:' + err);
                            });
                    } else {
                        throw new Error('cookies auth error 1');
                    }
                } else {
                    throw new Error('Cookie auth error 2');
                }
            })
            .catch((err) => {
                reject('Error while finding and matching shop');
            });
    }).catch((err) => {
        res.status(401).json({ msg: 'Bad request, Please re-authenticate!', error: true });
        console.log('> Something went wrong ', err.message ? err.message : err);
    });
}
