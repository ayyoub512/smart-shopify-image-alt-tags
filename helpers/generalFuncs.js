/**
 * Host  function that can be used 2 or more times
 */
const util = require("util");

const axios = require("axios");
const Bottleneck = require("bottleneck");

exports.templValueHandler = function (value, shopName, title, vendor, productType, handle) {
    let template = value.replace(/\[shop_name\]/gi, shopName);
    template = template.replace(/\[product_title\]/gi, title);
    template = template.replace(/\[product_vendor\]/g, vendor);
    template = template.replace(/\[product_type\]/gi, productType);
    template = template.replace(/\[product_handle\]/gi, handle);
    template = template.substring(0, 490);
    template = template.replace(/[^\w\s:\.,]/gi, "");

    return template;
};

// console.log(util.inspect(myObject, {showHidden: false, depth: null}))

exports.botlneckMutations = async function (shopOrigin, accessToken, mutations) {
    try {
        const limiter = new Bottleneck({
            reservoir: 70, // initial value
            reservoirIncreaseAmount: 5,
            reservoirIncreaseInterval: 1000, // must be divisible by 250
            reservoirIncreaseMaximum: 70,
        });

        let AllMutations = mutations.map((itemMutation) => {
            return limiter
                .schedule(() => {
                    return runMutation(shopOrigin, accessToken, itemMutation);
                })
                .then((data) => {
                    console.log(util.inspect(data.data, { showHidden: false, depth: null }));
                })
                .catch((err) => console.log("erro : ", err));
        });

        await Promise.all(AllMutations);

        return limiter.done();
    } catch (err) {
        console.log("Err: " + err);
        return err;
    }
};

function runMutation(shopOrigin, accessToken, mutation) {
    try {
        const axiosConfig = {
            url: "https://" + shopOrigin + "/admin/api/2021-01/graphql.json",
            method: "post",
            headers: {
                "Content-Type": "application/json",
                "X-Shopify-Access-Token": accessToken,
            },
            data: {
                query: mutation,
            },
        };

        return axios(axiosConfig);
    } catch (e) {
        return e.message ?? e;
    }
}
