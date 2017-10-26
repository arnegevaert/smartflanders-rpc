const dq = require('smartflanders-data-query');
const http = require('http');
const url = require('url');

let port = process.env.NODE_PORT;
if (!port) {
    console.error("No port specified! Usage: NODE_PORT=[PORT] pm2 start index.js");
    process.exit(1);
} else {
    console.log("Server running at port ", port);
}

http.createServer(function (req, res) {
    let path = url.parse(req.url).pathname;
    let query = url.parse(req.url).query;
    switch (path) {
        case '/':
            res.write('ROOT');
            if (query) {
                res.write(query);
            }
            break;
        default:
            res.writeHead(404);
            res.write('NOT GOOD');
            break;
    }
    res.end();
}).listen(8000);
console.log('Server running at localhost:8000');