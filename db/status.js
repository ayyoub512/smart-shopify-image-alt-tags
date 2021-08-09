// const mysql = require("mysql");
// const basefunc = require("../libs/basefunc");
// const { Shop } = require("../models/shopModel");

module.exports = {
    getLastStatus: function (shopOrigin) {
        // let query = "SELECT * FROM status WHERE shopId = ? ORDER BY id DESC";
        return new Promise(function (resolve, reject) {
            // Shop.find()
            let query = Shop.findOne({ shopOrigin });
            query.exec((err, result) => {
                if (err) return reject(err);

                // !0 === true . !!0 === false  basiclly : !!false = false. !!true = true
                // so below will execute if the result array isn't empty
                if (!!result.statuses.length) {
                    let lastStatus = result.statuses[result.statuses.length - 1];
                    console.log("Last status:: ", lastStatus);
                    return resolve(lastStatus);
                }
                return resolve(null);
            });

            //     db.query(query, shopId, function (err, result) {
            //         if (err) return reject(err);
            //         if (result.length > 0) return resolve(result[0]);
            //         else return resolve(null);
            //     });
            // Shop.find
        });
    },

    setStatus: function (shopOrigin, status, altFormula = null, productsProcessed = null, imgsProcessed = null) {
        return new Promise(function (resolve, reject) {
            const updateStatus = { $push: { tags: ["javascript"] } };
            Shop.findOneAndUpdate({ shopOrigin }, { $push: { statuses: [{ status, altFormula, imgsProcessed, productsProcessed }] } }, (err, result) => {
                // console.log("Result of update status: ", result);
                // console.log("ERROR of update status: ", err);

                if (err) return reject(err);
                if (result) return resolve(result);
                else return resolve(null);
            });
        });

        // let query = "INSERT INTO status SET shopId = ?, status= ?, altFormula = ?, productsProcessed = ?, imgsProcessed = ? ";
        // return new Promise(function (resolve, reject) {
        //     db.query(query, [shopId, status, altFormula, productsProcessed, imgsProcessed], function (err, result) {
        //         if (err) return reject(err);
        //         return resolve(result);
        //     });
        // });
    },
};
