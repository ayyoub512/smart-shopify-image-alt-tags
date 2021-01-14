const axios = require("axios");
const { v4 } = require("uuid");
const fs = require("fs");
const Path = require("path");
const { BULK_STATUS_QUERY, BULK_INIT_MUTATION } = require("../db/mutations");

/**
 *
 * @param {string} shop : Shop Origin
 * @param {string} token : secret access token
 * @param {Http2ServerResponse} resp : secret access token
 * @description Handels sending the bulk request and retreive the bulk request data back from the shopify api
 */
const initBulkRequest = (shop, token) => {
    return new Promise((resolve, reject) => {
        const url = "https://" + shop + "/admin/api/2021-01/graphql.json";

        console.log(shop, token);
        axios({
            url: url,
            method: "post",
            headers: {
                "Content-Type": "application/json",
                "X-Shopify-Access-Token": token,
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
                    console.log("\n[+] Init ID: ", res.data.data?.bulkOperationRunQuery?.bulkOperation?.id);
                }

                resolve(res);
            })
            .catch((err) => {
                console.log("ERROR");
                console.log(err);
                reject(err);
            });
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
        const apiUrl = "https://" + shop + "/admin/api/2021-01/graphql.json";

        // repeat with the interval of 2 seconds
        let timerId = setInterval(() => {
            console.log(" - No URL: new interval ");
            try {
                axios({
                    url: apiUrl,
                    method: "post",
                    headers: {
                        "Content-Type": "application/json",
                        "X-Shopify-Access-Token": token,
                    },
                    data: {
                        query: BULK_STATUS_QUERY,
                    },
                })
                    .then((res) => {
                        const url = res.data?.data?.currentBulkOperation?.url;

                        if (url) {
                            clearInterval(timerId);
                            console.log("[+] Found Url & Cleared the Interval");
                            resolve(url);
                        } else {
                            console.log(res?.data);
                        }
                    })
                    .catch((err) => {
                        clearInterval(timerId);
                        reject(err);
                    });
            } catch (err) {
                clearInterval(timerId);
                reject(err);
            }
        }, 2000);
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
        if (!jsonlURL) reject("500 Error, No valid url was passed to the server.");

        const fileName = v4() + ".JSONL";
        const jsonlFilePath = Path.resolve(global.appRoot, "files", fileName);

        axios({
            method: "get",
            url: jsonlURL,
            responseType: "stream", // important
        })
            .then((response) => {
                response.data.pipe(fs.createWriteStream(jsonlFilePath));

                response.data.on("end", () => {
                    resolve(jsonlFilePath);
                });
            })
            .catch((err) => {
                reject(err);
            });
    });
};

module.exports = {
    downloadJSONL,
    bulkStatusQuery,
    initBulkRequest,
};
