const axios = require('axios');
const { v4 } = require('uuid');
const fs = require('fs');
const Path = require('path');
import { BULK_STATUS_QUERY, BULK_INIT_MUTATION } from '../db/mutations';

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
                reject('Error (GetBulkData: initBulkRequest: Axios.catch) : ' + err);
            });
    }).catch((err) => {
        console.log('Error (GetBulkData: initBulkRequest: Promise.catch) : ', err.message ? err.message : err);
    });
};

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
                console.log(' >> 2 Second Interval Start');
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

                        if (url) {
                            clearInterval(timerId);
                            console.log('[+] Found Url & Cleared the Interval');
                            resolve(url);
                        }
                        // else {
                        //     console.log('\n \n \n [-] Didnt find the url yet, Intervalling again ', url);
                        // }
                    })
                    .catch((err) => {
                        console.log('Line 46 inside the bulk query status ' + err);
                    });
            }, 2000);
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
 * @param {string} jsonlURL : Link to the actual JSONL file to be stored
 * @returns {string} path : Path to the stored jsonl file
 * @description Downloads and stores the JSONL file
 */
const downloadJSONL = (jsonlURL) => {
    return new Promise((resolve, reject) => {
        if (!jsonlURL) reject('500 Error, No valid url was passed to the server.');

        const fileName = v4() + '.JSONL';
        const path = Path.resolve(global.appRoot, 'files', fileName);

        axios({
            method: 'get',
            url: jsonlURL,
            responseType: 'stream', // important
        })
            .then((response) => {
                response.data.pipe(fs.createWriteStream(path));

                response.data.on('end', () => {
                    resolve(path);
                });
            })
            .catch((err) => {
                console.log(err);
                reject(err);
            });
    }).catch((err) => {
        console.log('Error (GetBulkData: DownloadJSONL: .Promise.Catch): ', err);
    });
};

/**
 * @param {string} ShopOrigin arabycode.myshopify.com
 * @param {string} token  The access token
 * @returns {string} returns a string path of the jsonl file containing the data
 * @description getBulkData: InitBulk + check Status + Download the file;
 * does so with a series of function calls (above 😉)
 */
const getBulkData = (shop, token) => {
    return new Promise((resolve, reject) => {
        initBulkRequest(shop, token)
            .then((operationId) => {
                bulkStatusQuery(shop, token)
                    .then((jsonlURL) => {
                        console.log('Downloading the JSONL url');
                        downloadJSONL(jsonlURL)
                            .then((jsonlPath) => {
                                console.log('\n [+] Stored to: ', jsonlPath);
                                resolve(jsonlPath);
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
    }).catch((err) => {
        console.log('Error on getBulkData.IBSD.catch => :' + err);
    });
};

module.exports = {
    getBulkData,
};
