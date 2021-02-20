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

        email: String,

        supportEmail: String,

        status: [
            {
                status: {
                    type: Number,
                    default: 0,
                },

                templateValue: {
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

export default Shop;
