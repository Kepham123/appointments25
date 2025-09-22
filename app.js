
const http = require('http');
const url = require('url');
//create a server object:
let myserver = http.createServer(function (req, res) {
	let urlObj = url.parse(req.url,true);
	console.log(req.url);
	switch (urlObj.pathname){
		case "/schedule":
			schedule(urlObj.query,res);
			break
		case "/cancel":
			cancel();
			break;
		default:
			error(404,"pathname not found", res);
	}
 res.writeHead(200, {'Content-Type': 'text/plain'});
 res.write("recieved"); //write (send) a response to the client
 res.end(); //end the response
});
myserver.listen(80); //the server object listens on port 80

function schedule(queryObj,res) {
	if (availableTime[queryObj.day].some(element => element == queryObj.time))
		res.writeHead(200, {'Content-Type': 'text/plain'});
 		res.write("Scheduled"); //write (send) a response to the client
 		res.end(); //end the response
	}
	else;
		error(400, "unable to schedule",res);

}
function cancel() {



}
function error(status, message,res) {
	res.writeHead(status, {'Content-Type': 'text/plain'});
	res.write(message); //write (send) a response to the client
	res.end(); //end the response
}

  


}

const availableTimes = {
    Monday: ["1:00", "1:30", "2:00", "2:30", "3:00", "3:30", "4:00", "4:30"],
    Tuesday: ["1:00", "1:30", "2:00", "2:30", "3:00", "3:30", "4:00", "4:30"],
    Wednesday: ["1:00", "1:30", "2:00", "2:30", "3:00", "4:00", "4:30"],
    Thursday: ["1:00", "1:30", "2:00", "2:30", "3:00", "3:30", "4:00", "4:30"],
    Friday: ["1:30", "2:00", "2:30", "3:00", "3:30", "4:00", "4:30"],
};
const appointments = [
    {name: "James", day: "Wednesday", time: "3:30" },
    {name: "Lillie", day: "Friday", time: "1:00" }];
