const axios = require('axios');

function altTextMutation(shop, access_token, mutation) {
    return new Promise((resolve, reject) => {
        const url = 'https://' + shop + '/admin/api/2021-01/graphql.json';
        axios({
            url: url,
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Access-Token': access_token,
            },
            data: {
                query: mutation,
            },
        })
            .then((data) => {
                console.log(data.data);
                resolve(data.data);
            })
            .catch((err) => reject(err));
    });
}

module.exports = {
    altTextMutation,
};
