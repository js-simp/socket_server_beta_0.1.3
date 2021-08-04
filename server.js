const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;

const io = require("socket.io")(server, {
	cors: {
		origin: "http://localhost:3000",
		methods: ["GET", "POST"],
		allowedHeaders: ["my-custom-header"],
		credentials: true
	  }
});

io.on('connection', (socket) => {
	console.log('Client connected'+socket.id);

	socket.on('disconnect', () => {
		console.log('Client disconnected');
		 con = "connected"});

	socket.emit("me", socket.id);

	socket.on('canvas-data', (getDataFromClient) => {
		socket.broadcast.emit('canvas-data',getDataFromClient);
		canvas = getDataFromClient;
     });

	socket.on('chat-message',(msg)=> {
		console.log(msg)
		io.emit('chat message', msg);
		chat.push(msg);
		
	  });
    
    //  socket.to('room1').emit('I am room 1 from server');
	// io.to("room 237").emit("a new user has joined the room"); 
//https://stackoverflow.com/questions/17697199/socket-io-rooms-doesnt-work
/*-----------------------------socketserve.io --------------------------------------------- */


//1-click join session and execute  socket.emi("join_room","123456")
socket.on("join_room",(room) => {

    socket.join(room);//ok
	console.log("joined room is -"+room);
	socket.broadcast.emit("join_room",room);//sent all clent
	// console.log("All Rooms Array - "+room);
  });

  socket.on('drawing',(msg)=> {
	 // var arr = ["room1","room2"],push();
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
	let allRooms = socket.rooms;
	let clientRooms = Array.from(allRooms)
	for(let i=0; i<=clientRooms.length; i++) {
		socket.to(clientRooms[i]).emit("image",msg);
	  }
})

  socket.on("message", (msg) => {
	let allRooms = socket.rooms;
	let clientRooms = Array.from(allRooms)
	for(let i=0; i<=clientRooms.length; i++) {
		socket.to(clientRooms[i]).emit("message",msg);
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
