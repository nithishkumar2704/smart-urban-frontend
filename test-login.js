const https = require('https');

const data = JSON.stringify({
    email: 'provider@demo.com',
    password: 'wrongpassword' // Just testing connectivity, expect 401 or 400
});

const options = {
    hostname: 'smart-urban-backend-26kp.onrender.com',
    port: 443,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
        'Origin': 'https://smart-urban-frontend.vercel.app'
    }
};

console.log('Testing connectivity to:', options.hostname + options.path);

const req = https.request(options, (res) => {
    console.log('statusCode:', res.statusCode);
    console.log('headers:', res.headers);

    res.on('data', (d) => {
        process.stdout.write(d);
    });
});

req.on('error', (e) => {
    console.error('Request Error:', e);
});

req.write(data);
req.end();
