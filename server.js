const express = require("express");
const http = require("http");
const fs = require('fs');// for writing eventlog
const readline = require('readline');
const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;



async function get_events(sessionID, callback) {
	const fileStream = fs.createReadStream(`${sessionID}.txt`);
  
	const rl = readline.createInterface({
	  input: fileStream,
	  crlfDelay: Infinity
	});
	// Note: we use the crlfDelay option to recognize all instances of CR LF
	// ('\r\n') in input.txt as a single line break.
	let event_array = [];
	let start;
	  let end;
	for await (const line of rl) {
	  // Each line in input.txt will be successively available here as `line`.
	  let event = JSON.parse(line);
	  if("startTime" in event) {
		start = event.startTime;
		console.log(start);
	  }
	  else if ("endtime" in event) {
		end = event.endtime;
		console.log(end);
	  }
	  else {
		event.time = event.time - start;
		event_array.push(event)
	  }
	//   console.log(`Line from file: ${JSON.parse(line)}`);
	}
	  callback({
		status: "ok",
		duration : end - start,
		events : event_array
	  });	

	// console.log(event_array);
  }


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

	socket.on("regen", (sessionID, callback) => {
		console.log(`We got to regenerate session ${sessionID}`);
		get_events(sessionID, callback);
		
	})

	socket.on("endSession", () => {
		fs.appendFile(`${my_room}.txt`, JSON.stringify({endtime : Date.now()}) , 
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

