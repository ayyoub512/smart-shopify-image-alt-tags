import axios from 'axios';

const getData = (url) => {
    axios
        .get(url, { headers: { 'Access-Control-Allow-Origin': '*' } })
        .then((res) => {
            console.log('Result', res);
        })
        .catch((err) => {
            console.log(err);
        });
};

const processBulkData = () => {
    console.log('processing bulkData');
};

export default getData;
