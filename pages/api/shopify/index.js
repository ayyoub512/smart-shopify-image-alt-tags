const fs = require("fs");
var jwt = require("jsonwebtoken");

const shops = require("../../../db/shops");
const status = require("../../../db/status");

const getBulkData = require("../../../helpers/getBulkData");
const processData = require("../../../helpers/processData");

/**
 * @description Gets called when the user submites the tempalate
 * @URI /api/shopify/
 */
export default async function templateForm(req, res) {
    // Global placeholders to use later on..
    let jsonlFilePath;
    let shopName;
    let productsProcessed = 0;
    let imgsProcessed = 0;
    let templateValue;
    let shopId;
    let operationStatus = 1;

    return new Promise((resolve, reject) => {
        /**
         * Verify token and see if the current store on the cookies is the real store
         * we have on the databse
         */
        const undecodedToken = req.cookies["alt-text-app"];
        templateValue = req.body.templateValue;

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

        const shop = decoded.shopOrigin;
        const accessToken = decoded.accessToken;

        shops
            .findShopByName(shop)
            .then((data) => {
                if (data.shopOrigin && data.accessToken && data.shopOrigin == shop && data.accessToken == accessToken) {
                    /***
                     * this is a greate place to return something back to the user.
                     * If the request made it here meaning everything thats required from the user has been fulfilled,
                     * all left is for us to process the request.
                     */
                    shopName = data.shop_name;
                    shopId = data.id;

                    res.json({ msg: "The server has received your rquest and is processing it!", error: false });

                    console.log(" > Starting operation for ", shopName);

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

            .then((data) => {
                let [productsArray, countImgs] = data;
                imgsProcessed = countImgs;
                console.log("Counted, ", countImgs);
                productsProcessed = productsArray.length;

                return processData.processProductsArray(shop, accessToken, productsArray, templateValue, shopName);
            })

            .then((completedMutationsCount) => {
                // Lets update the status table with the recent value!
                // res.json({ msg: "Bad request, Please re-authenticate!", error: true });
                operationStatus = 1;
            })

            .catch((err) => {
                console.log(err);
                operationStatus = -1;
                reject(err);
            })

            .finally(async () => {
                productsProcessed;
                imgsProcessed;
                try {
                    if (shopId) {
                        await status.setStatus(
                            shopId,
                            operationStatus,
                            templateValue,
                            productsProcessed,
                            imgsProcessed
                        );
                    }

                    // DELETING THE FILE
                    if (jsonlFilePath) await fs.unlinkSync(jsonlFilePath);
                } catch (err) {
                    console.log(err);
                }
            });
        /**
         *
         *
         *
         */
    }).catch((err) => {
        console.log("Error ", err);
    });
}
