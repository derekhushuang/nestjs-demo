// This file is used to run health checks with Node in the Docker container

const http = require('http');

const options = {
    host: 'localhost',
    port: '3000',
    timeout: 2000,
};

const request = http.request(options, (res) => {
    console.info(`STATUS: ${res.statusCode}`);
    if (res.statusCode == 200) {
        process.exit(0);
    } else {
        process.exit(1);
    }
});

request.on('error', function (err) {
    console.info('ERROR');
    process.exit(1);
});

request.end();
