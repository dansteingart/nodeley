var http = require("http"); //HTTP Server
var url = require("url"); // URL Handling
var fs = require('fs'); // Filesystem Access (writing files)

var express = require('express'), //App Framework (similar to web.py abstraction)
    app = express();
	app.use(express.bodyParser());
	app.use(app.router);
io = require('socket.io'); //Socket Creations

var serialport = require("serialport") //Serial Port Creation
var SerialPort = require("serialport").SerialPort 
var serialPort = new SerialPort("/dev/ttyUSB0",{baudrate:57600,parser:serialport.parsers.readline("\r")});

app.use("/static", express.static(__dirname + '/static/'));
//app.use("/socket.io", express.static(__dirname + '/node_modules/socket.io/lib'));
app.get('/', function(req, res){
	indexer = fs.readFileSync('index.html').toString()
    res.send(indexer);
});

server = http.createServer(app)
io = io.listen(server); //Socket Creations
io.set('log level', 1)


porter = 4000
server.listen(porter);
console.log('Express server started on port %s', porter );

data_log = []

serialPort.on("data", function (data) {
	console.log("gotthing: " + data)
	io.sockets.emit('new_data',{'data':data})
	
})



io.sockets.on('connection', function (socket) {
	console.log("got_love");
  	socket.on('data_back', function (data) 
	{
		foo = data['data']
		console.log(foo)
		
		//io.sockets.emit('new_data',{'data':data})    
		serialPort.write(foo+"\n")
  	});
});

	
