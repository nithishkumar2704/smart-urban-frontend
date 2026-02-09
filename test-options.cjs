const https = require('https');

const options = {
    hostname: 'smart-urban-backend-26kp.onrender.com',
    port: 443,
    path: '/api/auth/login',
    method: 'OPTIONS',
    headers: {
        'Origin': 'https://smart-urban-frontend.vercel.app',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type'
    }
};

console.log('Testing OPTIONS (Preflight) to:', options.hostname + options.path);

const req = https.request(options, (res) => {
    console.log('statusCode:', res.statusCode);
    console.log('headers:', JSON.stringify(res.headers, null, 2));

    res.on('data', (d) => {
        process.stdout.write(d);
    });
});

req.on('error', (e) => {
    console.error('Request Error:', e);
});

req.end();
