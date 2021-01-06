import axios from 'axios';
const { v4 } = require('uuid');
const fs = require('fs');
const Path = require('path');
var jwt = require('jsonwebtoken');
const shops = require('../../../models/shops');
import { BULK_STATUS_QUERY, BULK_INIT_MUTATION } from '../../..//helpers/muations';

/**
 *
 * @param {string} shop : Shop Origin
 * @param {string} token : secret access token
 * @param {Http2ServerResponse} resp : secret access token
 * @description Handels sending the bulk request and retreive the bulk request data back from the shopify api
 */
const bulkStatusQuery = async (shop, token, url) => {
    return new Promise((resolve, reject) => {
        const apiUrl = 'https://' + shop + '/admin/api/2021-01/graphql.json';

        // repeat with the interval of 2 seconds
        let timerId = setInterval(() => {
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
                    // console.log('GOT THIS BACK  >', res.data);
                    const url = res.data.currentBulkOperation.url;
                    console.log('I am here, the data is', data, ' -- and the url is ', url);
                    if (url) {
                        console.log('Clearing the interval with the timer id :', timerId);
                        clearInterval(timerId);
                    }
                })
                .catch((err) => {
                    reject(err);
                });
        }).catch((err) => {
            console.log('Init bulk request error : ', err.message ? err.message : err);
        });
    }, 10000);
};

/**
 *
 * @param {string} shop : Shop Origin
 * @param {string} token : secret access token
 * @param {Http2ServerResponse} resp : secret access token
 * @description Handels sending the bulk request and retreive the bulk request data back from the shopify api
 */
const initBulkRequest = async (shop, token) => {
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
                const url = res.data.data.bulkOperationRunQuery.bulkOperation.id;
                if (!url) {
                    reject('Server Error, Please try again.');
                } else {
                    resolve(url);
                }
            })
            .catch((err) => {
                reject(err);
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
                                if (url) {
                                    bulkStatusQuery(decoded.shop_origin, decoded.access_token, url)
                                        .then((res) => {
                                            console.log('inside the index.s', res);
                                        })
                                        .catch((err) => {
                                            reject('Error while BulkStatus:136');
                                        });
                                }
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
