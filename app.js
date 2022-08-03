const express = require('express');
const app = express();
server = require('http').createServer(app);

let bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

app.use(
	bodyParser.json({
		limit: '50mb',
	})
);

app.use(express.json());
app.use(cors());
dotenv.config();

mongoose.connect(process.env.MONGODB_LOCAL_URL_DEPLOY, () => {
	console.log(200, '[CONNECT] -> Database');
});

const WebSocket = require('ws');
const serverWS = new WebSocket.Server({ server });

serverWS.on('connection', (ws) => {
	console.log(200, '[CONNECT] -> New Ws Client');

	ws.on('message', (data) => {
		console.log(1000, JSON.parse(data));
		serverWS.clients.forEach((client) => {
			client.send(data.toString());
		});
	});

	ws.on('close', () => {
		console.log(400, '[DISCONNECT] -> 1 Client Dissapear');
	});

	setInterval(() => {
		serverWS.clients.forEach((client) => {
			client.send(new Date().toTimeString());
		});
	}, 1000);
});

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname + '/index.html'));
});

server.listen(8808, () => {
	console.log(1000, `[OK] -> Server started on http://localhost:8808/`);
	console.log('');
});
