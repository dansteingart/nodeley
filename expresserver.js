var http = require("http"); //HTTP Server
var url = require("url"); // URL Handling
var fs = require('fs'); // Filesystem Access (writing files)

var express = require('express'), //App Framework (similar to web.py abstraction)
    app = express.createServer();
	app.use(express.bodyParser());
	app.use(app.router);
io = require('socket.io').listen(app); //Socket Creations
io.set('log level', 1)

var serialport = require("serialport") //Serial Port Creation
var SerialPort = require("serialport").SerialPort 
var serialPort = new SerialPort("/dev/tty.usbserial",{baudrate:57600,parser:serialport.parsers.readline("\r")});

app.use("/static", express.static(__dirname + '/static/'));
app.use("/socket.io", express.static(__dirname + '/node_modules/socket.io/lib'));
app.get('/', function(req, res){
	indexer = fs.readFileSync('index.html').toString()
    res.send(indexer);
});

app.listen(4000);
console.log('Express server started on port %s', app.address().port);

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
		//console.log(foo)
		
		//io.sockets.emit('new_data',{'data':data})    
		serialPort.write(foo+"\n")
  	});
});

	
