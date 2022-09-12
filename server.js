const express = require("express");
const http = require("http");
const fs = require('fs');// for writing eventlog
const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;



// async function save_events(msg, timestamp) {
// 	eventlog.push({msg, timestamp});
// }

//socket server instance
  
const io = require("socket.io")(server, {
	cors: {
		origin: "http://localhost:3000",
		methods: ["GET", "POST"],
		allowedHeaders: ["my-custom-header"],
		credentials: true
	  }
});

//connection is the event triggered when a new socket instance is created
io.on('connection', (socket) => {
	console.log('Client connected'+socket.id);
	let my_room = ''; //declaring designated room for session
	// socket.pipe(process.stdout);

	socket.on('disconnect', () => {
		console.log('Client disconnected');
		// console.log(eventlog);
 
	// writeFile function with filename, content and callback function
	fs.writeFile('sessionId.json', JSON.stringify(eventlog), function (err) {
  		if (err) throw err;
  		console.log('File is created successfully.');
		});
		 con = "connected"});

	socket.emit("me", socket.id);

	socket.on('canvas-data', (getDataFromClient) => {
		socket.broadcast.emit('canvas-data',getDataFromClient);
		canvas = getDataFromClient;
     });

	socket.on("join_room",(room) => {
		my_room = room; //assigning designated room for session
		if (!fs.existsSync(`${my_room}.txt`)) {
			//file doesn't exist therefore create file
			fs.appendFile(`${my_room}.txt`, JSON.stringify({startTime : Date.now()}) + '\n',
			function (err) {
				if (err) throw err;
				// console.log('Saved!');
			});
		}
		socket.join(room);//ok
		// console.log("joined room is -"+room);
		socket.broadcast.emit("join_room",room);//sent all clent
		// console.log("All Rooms Array - "+room);
	});

	socket.on('drawing',(msg)=> {
		// var arr = ["room1","room2"],push();
		// save_events(msg, timestamp, eventlog); //saving the events as it comes asynchronously
		let {x0, x1, y0, y1, toolName, color} = msg;
		fs.appendFile(`${my_room}.txt`, JSON.stringify({x0, x1, y0, y1, toolName, color, time : Date.now()}) + '\n', 
		function (err) {
			if (err) throw err;
			// console.log('Saved!');
		  });
		socket.to(my_room).emit("drawing",msg);

	});  

	socket.on('text', (msg)=> {
		let {x0,y0,text,color} = msg;
		fs.appendFile(`${my_room}.txt`, JSON.stringify({x0, y0,text, color, time : Date.now()}) + '\n', 
		function (err) {
			if (err) throw err;
			// console.log('Saved!');
		  });
		socket.to(my_room).emit("text",msg);

	})

	socket.on('image', (msg)=>{
		console.log(msg.src, msg.page, msg.title);
		
		socket.to(my_room).emit("image",msg);
		
	})

	socket.on("chat-message", (msg) => {

		socket.to(my_room).emit("chat-message",msg);
		
	});

	socket.on("endSession", () => {
		fs.appendFile(`${my_room}.txt`, JSON.stringify({endtime : Date.now()}) + '\n', 
		function (err) {
			if (err) throw err;
			// console.log('Saved!');
		  });
	})

  });


  app.get('/', (req, res) => {
	res.send("./"+  req.body +
    "\n" + "connection-" +	con + "-disconnect-" + dcon + 
	    "\n" + "call data-" + call +  
		 "\n"+ "answer data- " + answer + 
		  "\n"+ "chat data- "+ chat
	);
	
  });

  app.get('/a', (req, res) => {
	res.send("./a"+req.body);
  });
  
  app.get('/aa', (req, res) => {
	res.send("./aa"+req.body);
  });

server.listen(PORT, () => console.log('server is running on port '+PORT));

