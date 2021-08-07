const mysql = require("mysql");
const basefunc = require("../libs/basefunc");
const mongoose = require("mongoose");
const shopModel = require("../models/shopModel");

module.exports = {
    addShop: function (shop, accessToken) {
        this.findShopByName(shop).then((shopData) => {
            return new Promise(function (resolve, reject) {
                // let query = "INSERT INTO shops SET ?";
                if (shopData) {
                    this.updateShop(shop, accessToken);
                    return reject("Something went wrong, probably failed to update the shop");
                }
                shopData = {
                    shopOrigin: shop,
                    accessToken: accessToken,
                    // updatedAt: basefunc.getCurrentTimestamp(),
                };
                let shop = new Shop(shopData);
                // db.query(query, shopData, function (err, result) {
                //     if (err) return reject(err);
                //     return resolve(result);
                // });
                Shop.save(function (err) {
                    console.log("savedShop value, ", savedShop);
                    console.log("Returned Error, ", err);
                    if (err) return reject(err);
                    return resolve(null);
                });
            });
        });
    },

    findShopByName: function (shop) {
        // let query = "SELECT * FROM shops WHERE shopOrigin = ?";
        return new Promise(function (resolve, reject) {
            // db.query(query, shop, function (err, result) {
            //     if (err) return reject(err);
            //     if (result.length > 0) return resolve(result[0]);
            //     else return resolve(null);
            // });

            Shop.findOne({ shopOrigin: shop }, function (err, returnedShop) {
                console.log("Returned value, ", returnedShop);
                console.log("Returned Error, ", err);
                if (err) return reject(err);
                if (returnedShop) return resolve(returnedShop);
                else return resolve(null);
            });
        });
    },

    // Updates the shop to the new accessToken
    updateShop: function (shop, accessToken) {
        return new Promise(function (resolve, reject) {
            // let query = "UPDATE shops SET accessToken = ? WHERE shopOrigin = ?";
            // db.query(query, [accessToken, shop], function (err, result) {
            //     if (err) return reject(err);
            //     return resolve(result);
            // });
            Shop.findOneAndUpdate({ shopOrigin: shop }, { accessToken }, (err, updatedShop) => {
                console.log("updatedShop value, ", updatedShop);
                console.log("Returned Error, ", err);
                if (err) return reject(err);
                if (updatedShop) return resolve(updatedShop);
                else return resolve(null);
            });
        });
    },

    /**
     *
     * @param {*} shop the shopOrigin ex: arabycode.myshopify
     * @param {*} email the personal email for the customer
     * @param {*} contactEmail the business email for customer ex support[at]domain[dot]com
     * @param {*} shopName the shop name ex: Araby Code Shop
     */
    updateFields: function (shop, email, contactEmail, shopName) {
        typeof email == "undefined" ? (email = null) : email;
        typeof contactEmail == "undefined" ? (contactEmail = null) : contactEmail;
        typeof shopName == "undefined" ? (shopName = null) : shopName;

        let query =
            `UPDATE shops SET email = ` +
            mysql.escape(email) +
            `, contactEmail = ` +
            mysql.escape(contactEmail) +
            `, shopName = ` +
            mysql.escape(shopName) +
            `WHERE shopOrigin = ` +
            mysql.escape(shop);

        return new Promise(function (resolve, reject) {
            db.query(query, function (err, result) {
                if (err) return reject(err);
                return resolve(result);
            });
        });
    },
};
