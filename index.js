const sfquery = require('smartflanders-data-query');
const http = require('http');
const url = require('url');
const querystring = require('querystring');
const moment = require('moment');

let port = process.env.NODE_PORT;
if (!port) {
    console.error("No port specified! Usage: NODE_PORT=[PORT] pm2 start index.js");
    process.exit(1);
} else {
    console.log("Server running at port", port);
}

http.createServer(function (req, res) {
    let path = url.parse(req.url).pathname;
    switch (path) {
        case '/interval':
            getInterval(req, res);
            break;
        case '/parkings':
            getParkings(req, res);
            break;
        default:
            res.writeHead(404);
            res.write('Page not found.');
            break;
    }
}).listen(port);

const cities = {
    'Gent': 'https://linked.open.gent/parking/',
    'Kortrijk': 'https://kortrijk.datapiloten.be/parking',
    'Sint-Niklaas': 'https://sint-niklaas.datapiloten.be/parking',
    'Leuven': 'https://leuven.datapiloten.be/parking',
    'Nederland': 'https://nederland.datapiloten.be/parking'
};

function getInterval(req, res) {
    let query = url.parse(req.url).query;
    let parsed = querystring.parse(query);

    if (parsed.from && parsed.to && parsed.city) {
        let from = moment(parsed.from).unix();
        let to = moment(parsed.to).unix();
        let dataset = cities[parsed.city];
        if (from && to && dataset) {
            let dq = new sfquery();
            dq.addDataset(dataset);
            let data = [];
            dq.getInterval(from, to).subscribe(
                d => {data.push(d)},
                e => {},
                () => {
                    res.write(JSON.stringify(data));
                    res.end();
                }
            );
        } else {
            res.writeHead(400);
            res.write('Malformed arguments');
            res.end();
        }
    } else {
        res.writeHead(400);
        res.write('Malformed request: Provide at least from, to and city.');
        res.end();
    }
}

function getParkings(req, res) {
    let query = url.parse(req.url).query;
    let parsed = querystring.parse(query);

    if (parsed.city) {
        let dataset = cities[parsed.city];
        let dq = new sfquery();
        dq.addDataset(dataset);
        let data = [];
        dq.getParkings().subscribe(
            d => data.push(d),
            e => {},
            () => {
                res.write(JSON.stringify(data));
                res.end();
            }
        )
    } else {
        res.writeHead(400);
        res.write('Malformed request: Provide at least from, to and city.');
        res.end();
    }
}