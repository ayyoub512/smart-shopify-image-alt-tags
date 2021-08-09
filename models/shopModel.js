const mongoose = require("mongoose");

const shopSchema = mongoose.Schema(
    {
        shopOrigin: {
            type: String,
            required: true,
            unique: true,
        },
        accessToken: {
            type: String,
            required: true,
        },

        shopName: String,

        email: String,

        supportEmail: String,

        statuses: [
            {
                /**
                 * FIRST_TIME : The very first run
                 * IN_PROGRESS : last run in still in progress
                 * SUCCEEDED : last run succeeded
                 * FAILED : last run failed
                 * NEW_FIRST_TIME : when the customer wants to change the alt value and rerun the operation,
                 *     and probably will also do this for failed operations
                 */
                status: {
                    type: String,
                    default: "FIRST_TIME",
                },
                altFormula: {
                    type: String,
                    default: "[hiho]",
                },
                productsProcessed: Number,
                imgsProcessed: Number,
            },
        ],
    },
    { timestamps: true }
);

const Shop = mongoose.model("Shop", shopSchema);
// export default Shop;

module.exports = { Shop };
