import axios from 'axios';
const { v4 } = require('uuid');
const fs = require('fs');
const Path = require('path');

/**
 * @PROCESS data and make the request to the shopify
 * **/
const process = async (file) => {
    return new Promise((resolve, reject) => {});
};

export default async function download(req, res) {
    return new Promise((resolve, reject) => {
        const url = req.body.resultURL;
        res.setHeader('Content-Type', 'application/json');

        if (typeof url == 'undefined') {
            res.statusCode = 400;
            res.end(JSON.stringify({ data: '400 Error: No valid url was passed to the server. ' }));
            reject();
        }

        const fileName = v4() + '.JSONL';
        const path = Path.resolve(global.appRoot, 'files', fileName);

        axios({
            method: 'get',
            url,
            responseType: 'stream', // important
        })
            .then((response) => {
                response.data.pipe(fs.createWriteStream(path));

                response.data.on('end', () => {
                    res.send(
                        JSON.stringify({
                            data: "the bulkd request has been saved, now we're processing it",
                        })
                    );

                    process(path)
                        .then(() => {
                            res.send(
                                JSON.stringify({ data: 'Processing is done, now unto writing' })
                            );
                        })
                        .catch((err) => {
                            res.statusCode = 500;
                            console.log(err);
                            JSON.stringify({ data: 'Server error' });
                        });
                });
            })
            .catch((err) => {
                console.log(err);

                res.statusCode = 500;
                res.end(JSON.stringify({ data: '500 Server side error.' }));
                reject(err);
            });

        //     console.log('bulkFilesPath is', bulkFilesPath);
        //     res.statusCode = 200;
        //     res.setHeader('Content-Type', 'application/json');
        //     res.end(JSON.stringify({ data: 'result' }));
    });
}
