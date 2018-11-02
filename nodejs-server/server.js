var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var server = require('http').Server(app);
var io = require('socket.io')(server);
var path = require('path');
var os = require('os');
var pg = require('pg');
const cors = require('cors');

//DB Connect String
const conString = "postgres://xu:1234@localhost:5432/forest";
const client = new pg.Client(conString);
let pool = new pg.Pool(conString);

app.use(bodyParser.json())

app.use(express.static(path.join(__dirname, '/src')));
app.use(cors());
var interfaces = os.networkInterfaces();

var accelData;
var temp;
var port_number = server.listen(process.env.PORT || 8080);
server.listen(port_number, process.argv[2], function () {
	var host = server.address().address
	var port = server.address().port
	console.log("Server listening on %s:%s...", host, port);
});

app.get('/', function (req, res) {
	res.sendFile(__dirname + '/index.html');
});
app.get('/fire', (req, res) => {
	sendMeasurementAsJSON(client, res);
});
client.connect((err, db, done) => {
	if (err) {
		throw err;
	}
	
	console.log('Postgresql Connected...');
});

app.post('/accel', function (req, res) {

	accelData = req.body

	io.emit('accelData', accelData);

	temp = req.body.data.temp
});

io.on('connection', function (socket) {
	socket.on('location', function (data) {
		console.log(data);
	});
});

const getDbData = (client) => {
	return new Promise((resolve, reject) => {
		
			if (temp > 25) {
				client.query('INSERT INTO firedetect (sensor_id,temperature) VALUES($1,$2)',[1,temp],(err)=>{
					
					if(err){
						return console.log(err)
					}
				})
			}
		
		client.query('SELECT * from firedetect;', (err, result) => {
			if (err)
				reject(err);
			else
				resolve(result.rows);
		});
	});
};
function sendMeasurementAsJSON(client, result) {
	getDbData(client).then((res, error) => {
		result.json(res);
	}).catch((error) => {
		console.log("Failed！", error);
		result.send(400);
	});
}
