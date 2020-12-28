// import mongoose, { models } from 'mongoose';
const mongoose = require('mongoose');
// const models = mongoose.models;

/* PetSchema will correspond to a collection in your MongoDB database. */
const StoreSchema = new mongoose.Schema({
    store: {
        /* The name of this pet */
        type: String,
        required: [true, 'Please provide a store.'],
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

console.log('Printing Mongoose');
console.log(mongoose.models);

// let store = mongoose.models.store || mongoose.model('store', StoreSchema);

// module.exports = store;

// module.exports = Object.is(mongoose.models.store, undefined)
//     ? mongoose.model('store', StoreSchema)
//     : mongoose.models.store;

// module.exports =
//     mongoose.models.store === undefined
//         ? mongoose.model('store', StoreSchema)
//         : mongoose.models.store;

// module.exports = Store = mongoose.model('Store', StoreSchema);
// export default mongoose.model('Store', StoreSchema);
// module.exports = Store = mongoose.model('store', StoreSchema);
/** Dont know why this but following https://stackabuse.com/mongoose-with-nodejs-object-data-modeling/ */
// module.exports.db = mongoose;
