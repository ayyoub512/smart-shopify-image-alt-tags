import axios from 'axios';
const { v4 } = require('uuid');
const fs = require('fs');
const Path = require('path');
var jwt = require('jsonwebtoken');
const shops = require('../../../models/shops');
import { BULK_STATUS_QUERY, BULK_INIT_MUTATION } from '../../..//helpers/muations';
import { addShop } from '../../../models/shops';

/**
 *
 * @param {string} shop : Shop Origin
 * @param {string} token : secret access token
 * @param {Http2ServerResponse} resp : secret access token
 * @description Handels sending the bulk request and retreive the bulk request data back from the shopify api
 */
const bulkStatusQuery = (shop, token) => {
    return new Promise((resolve, reject) => {
        const apiUrl = 'https://' + shop + '/admin/api/2021-01/graphql.json';

        // repeat with the interval of 2 seconds
        try {
            let timerId = setInterval(() => {
                console.log('New Interval');
                axios({
                    url: apiUrl,
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Shopify-Access-Token': token,
                    },
                    data: {
                        query: BULK_STATUS_QUERY,
                    },
                })
                    .then((res) => {
                        const url = res.data.data.currentBulkOperation.url;
                        console.log('\n \n \n >>> the url is ');
                        if (url) {
                            clearInterval(timerId);
                            console.log('[+] Cleared the Interval');
                            resolve(url);
                        }
                    })
                    .catch((err) => {
                        console.log('Line 46 inside the bulk query status ' + err);
                    });
            }, 10000);
        } catch (err) {
            console.log('Line 50 try catch inside the bulk query status ' + err);
            reject(err);
        }
    }).catch((err) => {
        console.log('Line 50 try catch inside the bulk query status ' + err);
    });
};

/**
 *
 * @param {string} shop : Shop Origin
 * @param {string} token : secret access token
 * @param {Http2ServerResponse} resp : secret access token
 * @description Handels sending the bulk request and retreive the bulk request data back from the shopify api
 */
const initBulkRequest = (shop, token) => {
    return new Promise((resolve, reject) => {
        const url = 'https://' + shop + '/admin/api/2021-01/graphql.json';
        axios({
            url: url,
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Access-Token': token,
            },
            data: {
                query: BULK_INIT_MUTATION,
            },
        })
            .then((res) => {
                const userErrorsObject = res.data.data.bulkOperationRunQuery.userErrors;
                const errorsChildrens = Object.keys(userErrorsObject);

                if (errorsChildrens.length > 0) {
                    res.data.data.bulkOperationRunQuery.userErrors.map((item) => {
                        console.log(item.message);
                    });
                } else {
                    console.log('\n[+] Init ID: ', res.data.data.bulkOperationRunQuery.bulkOperation.id);
                }

                resolve();
            })
            .catch((err) => {
                reject('Axios.catch init bulk request errro : -> ' + err);
            });
    }).catch((err) => {
        console.log('Init bulk request error : ', err.message ? err.message : err);
    });
};

/**
 * @description Gets called when the user submites the tempalate form
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

                        initBulkRequest(decoded.shop_origin, decoded.access_token)
                            .then((url) => {
                                bulkStatusQuery(decoded.shop_origin, decoded.access_token)
                                    .then((myData) => {
                                        console.log('Data gg .. ');
                                    })
                                    .catch((err) => {
                                        console.log('rer', err);
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
