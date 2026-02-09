const https = require('https');

const options = {
    hostname: 'smart-urban-backend-26kp.onrender.com',
    port: 443,
    path: '/',
    method: 'GET',
    headers: {
        'Origin': 'https://smart-urban-frontend.vercel.app'
    }
};

const req = https.request(options, (res) => {
    console.log('statusCode:', res.statusCode);
    console.log('headers:', res.headers);

    res.on('data', (d) => {
        process.stdout.write(d);
    });
});

req.on('error', (e) => {
    console.error(e);
});

req.end();
