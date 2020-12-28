const mongoose = require('mongoose');

Object.keys(mongoose.connection.models).forEach((key) => {
    delete mongoose.connection.models[key];
});

try {
    mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        createIndexes: true,
        useFindAndModify: false,
    });

    mongoose.Promise = global.Promise;

    console.log('db connected ...');
} catch (err) {
    console.log(err);
    process.exit(1);
}

module.exports = mongoose;
