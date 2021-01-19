// const mysql = require("mysql");
// const basefunc = require("../libs/basefunc");

module.exports = {
    getLastStatus: function (shopId) {
        let query = "SELECT * FROM status WHERE shopId = ? ORDER BY id DESC";
        return new Promise(function (resolve, reject) {
            db.query(query, shopId, function (err, result) {
                if (err) return reject(err);
                if (result.length > 0) return resolve(result[0]);
                else return resolve(null);
            });
        });
    },

    setStatus: function (shopId, status, templateValue = null, productsProcessed = null, imgsProcessed = null) {
        let query =
            "INSERT INTO status SET shopId = ?, status= ?, templateValue = ?, productsProcessed = ?, imgsProcessed = ? ";
        return new Promise(function (resolve, reject) {
            db.query(query, [shopId, status, templateValue, productsProcessed, imgsProcessed], function (err, result) {
                if (err) return reject(err);
                return resolve(result);
            });
        });
    },
};
