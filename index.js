const express = require('express');
const app = express();
const PORT = process.env.PORT || 8000;
const crypto = require('crypto');
const https = require('https')

app.get('/', (request, response) => {
	const token = "c6d8001cb9de02cfe29709f825f32d335f9d63cd6dee69ca304675efb2e5c66a50376c1d94afef4a0b0b6ddf3505939a";
	const secret = "005efa212c2f76f6ed9aa4ad4523f9e8";
	const t = Date.now();
	const nonce = "requestID";
	const data = token + t + nonce;
	const signTerm = crypto.createHmac('sha256', secret)
	    .update(Buffer.from(data, 'utf-8'))
	    .digest();
	const sign = signTerm.toString("base64");
	console.log(sign);

	const body = JSON.stringify({
	    "command": "turnOn",
	    "parameter": "default",
	    "commandType": "command"
	});
	const deviceId = "D6254F3CD567";
	const options = {
	    hostname: 'api.switch-bot.com',
	    port: 443,
	    path: `/v1.1/devices/${deviceId}/commands`,
	    method: 'POST',
	    headers: {
	        "Authorization": token,
	        "sign": sign,
	        "nonce": nonce,
	        "t": t,
	        'Content-Type': 'application/json',
	        'Content-Length': body.length,
	    },
	};

	// FETCH DEVICE IDS
	// const options = {
	//     hostname: 'api.switch-bot.com',
	//     port: 443,
	//     path: `/v1.1/devices`,
	//     method: 'GET',
	//     headers: {
	//         "Authorization": token,
	//         "sign": sign,
	//         "nonce": nonce,
	//         "t": t,
	//         'Content-Type': 'application/json',
	//         'Content-Length': body.length,
	//     },
	// };


	const req = https.request(options, res => {
	    console.log(`statusCode: ${res.statusCode}`);
	    res.on('data', d => {
	        process.stdout.write(d);
	    });
	});

	req.on('error', error => {
	    console.error(error);
	});

	req.write(body);
	req.end();

    response.send(`<h2>Opened The Door!</h2>`)
});

app.listen(PORT, () => {
    console.log(`App is listening on http://localhost:${PORT}`);
})