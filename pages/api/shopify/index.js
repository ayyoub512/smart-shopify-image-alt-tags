const fs = require("fs");
var jwt = require("jsonwebtoken");
const shops = require("../../../db/shops");

const getBulkData = require("../../../helpers/getBulkData");
const processData = require("../../../helpers/processData");

/**
 * @description Gets called when the user submites the tempalate
 * @URI /api/shopify/
 */
export default async function templateForm(req, res) {
    let jsonlFilePath;

    return new Promise((resolve, reject) => {
        /**
         * Verify token and see if the current store on the cookies is the real store
         * we have on the databse
         */
        const undecodedToken = req.cookies["alt-text-app"];
        const templateValue = req.body.templateValue;

        if (!undecodedToken || !templateValue) {
            console.log("400 Bad Request");
            throw new Error("400 Bad Request");
        }

        let decoded;
        try {
            decoded = jwt.verify(undecodedToken, process.env.JWT_SECRET);
        } catch (err) {
            throw new Error("401 Authorisation denied!");
        }

        const shop = decoded.shop_origin;
        const accessToken = decoded.access_token;
        let shopName;

        shops
            .findShopByName(shop)
            .then((data) => {
                if (
                    data.shop_origin &&
                    data.access_token &&
                    data.shop_origin == shop &&
                    data.access_token == accessToken
                ) {
                    /***
                     * this is a greate place to return something back to the user.
                     * If the request made it here meaning everything thats required from the user has been fulfilled,
                     * all left is for us to process the request.
                     */
                    shopName = data.shop_name;
                    res.json({ msg: "The server has received your rquest and is processing it!", error: false });

                    return getBulkData.initBulkRequest(shop, accessToken);
                } else {
                    throw new Error("Autorisation not permitted");
                }
            })

            .then((initBulkRequestResponse) => {
                return getBulkData.bulkStatusQuery(shop, accessToken);
            })

            .then((jsonlURL) => {
                return getBulkData.downloadJSONL(jsonlURL);
            })

            .then((jsonlFilePath_) => {
                jsonlFilePath = jsonlFilePath_;
                return processData.processFile(jsonlFilePath_);
            })

            .then((resultsArray) => {
                return processData.processResultsArray(shop, accessToken, resultsArray, templateValue, shopName);
            })

            .then((mutationDone) => {
                fs.unlinkSync(jsonlFilePath);

                if (mutationDone) console.log("Mutation Done") && resolve();
                else console.log("Mutation not done") && reject("Something went wrong while mutation");
            })

            .catch((err) => {
                if (jsonlFilePath) fs.unlinkSync(jsonlFilePath);
                console.log(err);
                reject(err);
            });
    }).catch((err) => {
        if (jsonlFilePath) fs.unlinkSync(jsonlFilePath);
        console.log("> Something went wrong ", err.message ? err.message : err);

        res.status(401).json({ msg: "Bad request, Please re-authenticate!", error: true });
    });
}
