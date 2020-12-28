const mongose = require('mongoose');

const dbConnect = async () => {
    try {
        await mongose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            createIndexes: true,
            useFindAndModify: false,
        });

        console.log('db connected ...');
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
};

module.exports = dbConnect;
