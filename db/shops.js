const mysql = require("mysql");
const basefunc = require("../libs/basefunc");

module.exports = {
    addShop: function (shop, accessToken) {
        this.findShopByName(shop).then((shopData) => {
            if (shopData) {
                this.updateShop(shop, accessToken);
                return;
            }
            shopData = {
                shop_origin: shop,
                access_token: accessToken,
                added_time: basefunc.getCurrentTimestamp(),
            };
            let query = "INSERT INTO shops SET ?";
            return new Promise(function (resolve, reject) {
                db.query(query, shopData, function (err, result) {
                    if (err) return reject(err);
                    return resolve(result);
                });
            });
        });
    },

    findShopByName: function (shop) {
        let query = "SELECT * FROM shops WHERE shop_origin = ?";
        return new Promise(function (resolve, reject) {
            db.query(query, shop, function (err, result) {
                if (err) return reject(err);
                if (result.length > 0) return resolve(result[0]);
                else return resolve(null);
            });
        });
    },

    updateShop: function (shop, accessToken) {
        let query = "UPDATE shops SET access_token = ? WHERE shop_origin = ?";
        return new Promise(function (resolve, reject) {
            db.query(query, [accessToken, shop], function (err, result) {
                if (err) return reject(err);
                return resolve(result);
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
            `, contact_email = ` +
            mysql.escape(contactEmail) +
            `, shop_name = ` +
            mysql.escape(shopName) +
            `WHERE shop_origin = ` +
            mysql.escape(shop);

        return new Promise(function (resolve, reject) {
            db.query(query, function (err, result) {
                if (err) return reject(err);
                return resolve(result);
            });
        });
    },

    setStatus: function (shop, status) {
        let query = "UPDATE shops SET status = ? WHERE shop_origin = ?";
        return new Promise(function (resolve, reject) {
            db.query(query, [status, shop], function (err, result) {
                if (err) return reject(err);
                return resolve(result);
            });
        });
    },
};
