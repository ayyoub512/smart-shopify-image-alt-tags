export default async function (req, resp) {
    console.log('BODY ================', req.body); // The request body
    // console.log('',req.query); // The url query string
    console.log('Cookies ============= ', req.cookies); // The passed cookies
    res.end('Hello World');
}

// export default function handler(req, res) {
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'application/json');
//     res.end(JSON.stringify({ name: 'John Doe' }));
// }
