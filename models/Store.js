const mongoose = require('../utils/dbConnect');

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
        type: String,
        required: [true, 'date is required'],
    },
});

console.log(mongoose.models);

module.exports = Store = mongoose.model('store', StoreSchema);
