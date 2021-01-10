var jwt = require('jsonwebtoken');
const shops = require('../../../models/shops');
const getBulkData = require('../../../helpers/getBulkData');
const processBulkData = require('../../../helpers/processBulkData');
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
                        /**
                         * Initiate a bulk request with interval
                         * here
                         */

                        getBulkData
                            .initBulkRequest(decoded.shop_origin, decoded.access_token)
                            .then((operationId) => {
                                getBulkData
                                    .bulkStatusQuery(decoded.shop_origin, decoded.access_token)
                                    .then((jsonlURL) => {
                                        console.log('Downloading the JSONL url');
                                        getBulkData
                                            .downloadJSONL(jsonlURL)
                                            .then((jsonlPath) => {
                                                console.log('\n [+] Stored to: ', jsonlPath);

                                                /** Proccess the bulk Data here */
                                                processBulkData
                                                    .readFile(jsonlPath)
                                                    .then((data) => {
                                                        console.log('\n\n WRITING DATA TO A NEW FILE');

                                                        const path = Path.resolve(
                                                            global.appRoot,
                                                            'files',
                                                            'mydata.json'
                                                        );

                                                        fs.writeFile(
                                                            path,

                                                            JSON.stringify(data),

                                                            function (err) {
                                                                if (err) {
                                                                    console.error('Crap happens', err);
                                                                }
                                                            }
                                                        );

                                                        // var file = fs.createWriteStream(path);
                                                        // file.on('error', function (err) {
                                                        //     /* error handling */
                                                        //     console.log('Error while writing' + err);
                                                        // });

                                                        // data.forEach((v) => {
                                                        //     file.write(v.toString());
                                                        // });
                                                        // file.end();
                                                        resolve();
                                                    })
                                                    .catch((err) => {
                                                        reject('Erro on index:processBulkData.readfile.catch: ' + err);
                                                    });
                                            })
                                            .catch((err) => {
                                                reject('Error, Index(downloadJSONL.catch): ' + err);
                                            });
                                    })
                                    .catch((err) => {
                                        reject('Error, Index(BulkStatusQuery.catch): ' + err);
                                    });
                            })
                            .catch((err) => {
                                reject('Error while InitBulkRequest:105');
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
