const fs = require('fs');
const http = require('http');
const url = require('url');

const json = fs.readFileSync(`${__dirname}/data/data.json`, 'utf-8');
const laptopData = JSON.parse(json);

const server = http.createServer((req, res) => {

    const pathName = url.parse(req.url, true).pathname;
    const id = url.parse(req.url, true).query.id;

    if(pathName === '/products' || pathName === '/') {
        res.writeHead(200, {'Content-type': 'text/html'});
        fs.readFile(`${__dirname}/template/template-overview.html`, 'utf-8', (err, data) => {
            let overviewOutput = data;

            fs.readFile(`${__dirname}/template/template-card.html`, 'utf-8', (err, data) => {
                const laptopOutput = laptopData.map(el => templateReplace(data, el)).join('');
                overviewOutput = overviewOutput.replace('{%CARD%}', laptopOutput);
                res.end(overviewOutput);
            });
        });
    }
    
    else if(pathName === '/laptop' && id < laptopData.length) {
        res.writeHead(200, {'Content-type': 'text/html'});

        fs.readFile(`${__dirname}/template/template-laptop.html`, 'utf-8', (err, data) => {
            const laptop = laptopData[id];

            res.end(templateReplace(data, laptop));
        });
    }

    else if((/\.(jpg|jpeg|png)$/i).test(pathName)) {
        
        fs.readFile(`${__dirname}/data/img/${pathName}`, (err, data) => {
            res.writeHead(200, {'Content-type': 'image/jpg'});
            res.end(data);

        });
    }

    else {
        res.writeHead(404, {'Content-type': 'text/html'});
        res.end('Page was not found on the server!');
    }

});

server.listen(1337, '127.0.0.1', () => {
    console.log('Listening for request now')
});

function templateReplace(originalHtml, laptop) {
    let output = originalHtml.replace(/{%PRODUCTNAME%}/g, laptop.productName);
    output = output.replace(/{%PRICE%}/g, laptop.price);
    output = output.replace(/{%STORAGE%}/g, laptop.storage);
    output = output.replace(/{%CPU%}/g, laptop.cpu);
    output = output.replace(/{%RAM%}/g, laptop.ram);
    output = output.replace(/{%IMAGE%}/g, laptop.image);
    output = output.replace(/{%SCREEN%}/g, laptop.screen);
    output = output.replace(/{%DESCRIPTION%}/g, laptop.description);
    output = output.replace(/{%ID%}/g, laptop.id);

    return output;
}