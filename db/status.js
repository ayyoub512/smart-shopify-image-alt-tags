// const mysql = require("mysql");
// const basefunc = require("../libs/basefunc");

const { Shop } = require("../models/shopModel");

module.exports = {
    getLastStatus: function (shopOrigin) {
        // let query = "SELECT * FROM status WHERE shopId = ? ORDER BY id DESC";
        return new Promise(function (resolve, reject) {
            Shop.findOne({ shopOrigin }, (err, result) => {
                console.log(result);
                if (err) return reject(err);
                if (result) return resolve(result);
                else return resolve(null);
            });
            //     db.query(query, shopId, function (err, result) {
            //         if (err) return reject(err);
            //         if (result.length > 0) return resolve(result[0]);
            //         else return resolve(null);
            //     });
            // Shop.find
        });
    },

    setStatus: function (shopOrigin, status, templateValue = null, productsProcessed = null, imgsProcessed = null) {
        return new Promise(function (resolve, reject) {
            const updateStatus = { $push: { tags: ["javascript"] } };
            Shop.findOneAndUpdate({ shopOrigin }, { $push: { statuses: [{ status, templateValue, imgsProcessed, productsProcessed }] } }, (err, result) => {
                console.log("Result of update status: ", result);
                console.log("ERROR of update status: ", err);

                if (err) return reject(err);
                if (result) return resolve(result);
                else return resolve(null);
            });
        });

        // let query = "INSERT INTO status SET shopId = ?, status= ?, templateValue = ?, productsProcessed = ?, imgsProcessed = ? ";
        // return new Promise(function (resolve, reject) {
        //     db.query(query, [shopId, status, templateValue, productsProcessed, imgsProcessed], function (err, result) {
        //         if (err) return reject(err);
        //         return resolve(result);
        //     });
        // });
    },
};
