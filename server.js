const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;

const io = require("socket.io")(server, {
	cors: {
		origin: [process.env.APP_SERVER, 'http://localhost:3000', process.env.TEST_SERVER],
		methods: ["GET", "POST"],
		allowedHeaders: ["my-custom-header"],
		credentials: true
	  }
});

io.on('connection', (socket) => {
	// console.log('Client connected'+socket.id);

	let myroom = '';

	socket.on('disconnect', () => {
		console.log('Client disconnected');
		 con = "connected"});

	socket.emit("me", socket.id);

	socket.on('canvas-data', (getDataFromClient) => {
		socket.broadcast.emit('canvas-data',getDataFromClient);
		canvas = getDataFromClient;
     });

	socket.on("join_room",(room) => {

		socket.join(room);//ok
		myroom = room;
		// console.log("joined room is -"+room);
		socket.broadcast.emit("join_room",room);//sent all clent
		// console.log("All Rooms Array - "+room);
	});

	socket.on('drawing',(msg)=> {
		socket.to(myroom).emit("drawing", msg);

	});  

	socket.on('text', (msg)=> {
	
		socket.to(myroom).emit("text",msg);

	})

	socket.on('image', (msg)=>{
		// console.log(msg.src, msg.page, msg.title);
		socket.to(myroom).emit("image",msg);
	})

	socket.on("chat-message", (msg) => {
		socket.to(myroom).emit("chat-message",msg);

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

