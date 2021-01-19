/**
 * Host  function that can be used 2 or more times
 */
const util = require("util");

const axios = require("axios");
const Bottleneck = require("bottleneck");
const { Console } = require("console");

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
        let reservoir = await throttleStatus(shopOrigin, accessToken);
        reservoir = Number.isInteger(reservoir) ? Math.floor(reservoir / 10) - 15 : 20;
        console.log("throttleStatus, reserver set to  ", reservoir);

        // console.log(mutations);

        const limiter = new Bottleneck({
            reservoir: reservoir, // initial value
            reservoirIncreaseAmount: 3,
            reservoirIncreaseInterval: 1000, // must be divisible by 250
            reservoirIncreaseMaximum: 40,

            // also use maxConcurrent and/or minTime for safety
            maxConcurrent: 5,
            minTime: 250,
        });

        let AllMutations = mutations.map((itemMutation) => {
            console.log("Item Mutaiton");
            return limiter
                .schedule(() => {
                    return prepareMutations(shopOrigin, accessToken, itemMutation);
                })
                .then((resp) => {
                    // console.log(util.inspect(data.data, { showHidden: false, depth: null }));
                    console.log("Currently Avai");
                    console.log(resp?.data?.extensions?.cost?.throttleStatus?.currentlyAvailable);
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

function prepareMutations(shopOrigin, accessToken, mutation) {
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

function runQuery(shopOrigin, accessToken, query) {
    return new Promise((resolve, reponse) => {
        const url = "https://" + shopOrigin + "/admin/api/2021-01/graphql.json";
        axios({
            url: url,
            method: "post",
            headers: {
                "Content-Type": "application/json",
                "X-Shopify-Access-Token": accessToken,
            },
            data: {
                query: query,
            },
        })
            .then((data) => {
                // console.log(util.inspect(data.data, { showHidden: false, depth: null }));
                resolve(data);
            })
            .catch((err) => {
                console.log(err);
            });
    });
}

async function throttleStatus(shopOrigin, accessToken) {
    let query = `
        query{
            shop{
                myshopifyDomain
            }
        }
    `;

    const resp = await runQuery(shopOrigin, accessToken, query);

    return resp?.data?.extensions?.cost?.throttleStatus?.currentlyAvailable;
}
