const readline = require('readline');
const fs = require('fs');

let res = {};

function processLine(line) {
    const { id, __parentId } = JSON.parse(line);

    // console.log('ID:', id);
    // console.log('Parent ID', __parentId);

    // if there is no `__parentId`, this is a parent
    if (typeof __parentId === 'undefined') {
        res[line.id] = {
            id,
            childrens: [],
        };
        return res;
    }

    // this is a child, create its parent if necessary
    if (typeof res[__parentId] === 'undefined') {
        res[__parentId] = {
            id: __parentId,
            childrens: [],
        };
    }

    // add child to parent's children
    res[__parentId].childrens.push(line);
    return res;
}

const readInterface = readline.createInterface({
    input: fs.createReadStream('679aa7bd-a6a0-402d-96b7-5add2d68f5c7.JSONL'),
    // output: process.stdout,
    console: false,
});

readInterface.on('line', processLine);

readInterface.on('close', function () {
    const resultArray = Object.values(res);
    // console.log(resultArray);
});
