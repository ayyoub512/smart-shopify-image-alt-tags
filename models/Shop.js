// import mongoose, { models } from 'mongoose';
const mongoose = require('mongoose');
// const models = mongoose.models;

/* PetSchema will correspond to a collection in your MongoDB database. */
const ShopSchema = new mongoose.Schema({
    shop: {
        /* The name of this pet */
        type: String,
        required: [true, 'Please provide a shop.'],
    },
    accessToken: {
        type: String,
        required: [true, 'An accessToken is required.'],
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model('shop', ShopSchema) || mongoose.models.Shop;

// module.exports = Store = mongoose.model('Store', StoreSchema);
// export default mongoose.model('Store', StoreSchema);
// module.exports = Shop = mongoose.model('shop', ShopSchema);
/** Dont know why this but following https://stackabuse.com/mongoose-with-nodejs-object-data-modeling/ */
// module.exports.db = mongoose;

// fetch('https://7c9818f7db8f.ngrok.io/api/shopify', {
//                     method: 'POST',
//                     credentials: 'include',
//                     headers: {
//                         'Content-Type': 'application/json',
//                         'X-Shopify-Access-Token': accessToken,
//                     },
//                     body: JSON.stringify({
//                         shop,
//                         accessToken,
//                     }),
//                 })
//                     .then((response) => {
//                         console.log('Now the fetch is sent ');
//                         console.log(response, 'Awaiting response logged');
//                     })
//                     .catch((error) => {
//                         console.log('error', error);
//                     });
