const express = require("express");
const http = require("http");
const fs = require('fs');// for writing eventlog
const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;



async function save_events(msg, timestamp, eventlog) {
	eventlog.push({msg, timestamp});
}
  
const io = require("socket.io")(server, {
	cors: {
		origin: "http://localhost:3000",
		methods: ["GET", "POST"],
		allowedHeaders: ["my-custom-header"],
		credentials: true
	  }
});

io.on('connection', (socket) => {
	// console.log('Client connected'+socket.id);
	// socket.pipe(process.stdout);
	let timestamp = 0;
	let eventlog = [];
	const timeoutObj = setInterval(() => {
	timestamp += 10; 
  	}, 10); //logging every 1/100th of a second

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

		socket.join(room);//ok
		// console.log("joined room is -"+room);
		socket.broadcast.emit("join_room",room);//sent all clent
		// console.log("All Rooms Array - "+room);
	});

	socket.on('drawing',(msg)=> {
		// var arr = ["room1","room2"],push();
		save_events(msg, timestamp, eventlog); //saving the events as it comes asynchronously
		let allRooms = socket.rooms;
		let clientRooms = Array.from(allRooms)
		//iterate through the rooms and emmit draw to all the rooms in the array
		for(let i=0; i<=clientRooms.length; i++) {
			socket.to(clientRooms[i]).emit("drawing",msg);
		}

	});  

	socket.on('text', (msg)=> {
		let allRooms = socket.rooms;
		let clientRooms = Array.from(allRooms)
		for(let i=0; i<=clientRooms.length; i++) {
			socket.to(clientRooms[i]).emit("text",msg);
		}

	})

	socket.on('image', (msg)=>{
		console.log(msg.src, msg.page, msg.title);
		let allRooms = socket.rooms;
		let clientRooms = Array.from(allRooms)
		for(let i=0; i<=clientRooms.length; i++) {
			socket.to(clientRooms[i]).emit("image",msg);
		}
	})

	socket.on("chat-message", (msg) => {
		let allRooms = socket.rooms;
		let clientRooms = Array.from(allRooms)
		for(let i=0; i<=clientRooms.length; i++) {
			socket.to(clientRooms[i]).emit("chat-message",msg);
		}
	});

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

