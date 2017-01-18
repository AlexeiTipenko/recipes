/*
		Name: Alexei Tipenko (100995947)
		Date: Monday, October 31st, 2016

		* Developed in MacOS *
		* Tested with Chrome browser *

		Program: a small web application that uses the native capabilities of Node.js and javascript.
		         This application allows a user to store and retrieve recipes hosted by the server.
		         (Server and Client-side)
*/


//simple server listens on the provided port and responds with requested pages
// load modules
var url = require('url');
var http = require('http');
var fs = require('fs');
var mime = require('mime-types');
const ROOT = "./public_html";

// create http server
var server = http.createServer(handleRequest);
server.listen(2406);
console.log('Server listening on port 2406');


// handler for incoming requests
function handleRequest(req, res) {
	//process the request
	console.log("Request for: "+req.url);
	var urlObj = url.parse(req.url,true);
	var query = urlObj.query;
	var pathname = urlObj.pathname;
	var filename = ROOT+pathname;
	var code;
	var data = "";
	console.log("Query: ", query);

	fs.stat(filename, function(err, stats) {		//Checking if file exists (synchronous)

		if(err){   																//try and open the file and
			respondErr(err);												//handle the error
		}

		else if (req.method === "POST") {					//If the request from webpage is POST
			console.log("POST");
			var body = '';
			req.on('data', function (data) {
					body += data;
			});
			req.on('end', function () {

					fs.writeFile(ROOT + req.url, body, function (err) {					//write the new conents to the file
			    	if (err) {
							return console.log(err);
						}
					});
			});
			respond(200, data);
		}

		else {

			if(stats.isDirectory()){								//If stats object is a directory
				if (pathname === "/recipes/") {				//check if it's pathname is recipes

					fs.readdir(filename,function(err, files){  //async, read directory

						if(err){   												//try and open the file and handle the error, handle the error
							respondErr(err);
						}
						else {
							respond(200,files.join("<br/>"));
						}
					});
				}

				else {																//otherwise, add index.html to filename string
					filename += "/index.html";
					fs.readFile(filename, "utf8", function(err, data) {
						if(err){   												//try and open the file and handle the error, handle the error
							respondErr(err);
						}
						else respond(200, data);
					});
				}
			}

			else {																	//if not a directory, try reading the file

				fs.readFile(filename, "utf8", function(err, data) {
					if(err){   													//try and open the file and handle the error, handle the error
						respondErr(err)
					}
					else respond(200, data);
				});
			}
		}
	});


	//locally defined helper function
	//serves 404 files
	function serve404(){
		fs.readFile(ROOT+"/404.html","utf8",function(err,data){ //async
			if(err)respond(500,err.message);
			else respond(404,data);
		});
	}

	//locally defined helper function
	//responds in error, and outputs to the console
	function respondErr(err){
		console.log("Handling error: ", err);
		if(err.code==="ENOENT"){
			serve404();
		}else{
			respond(500,err.message);
		}
	}

	//locally defined helper function
	//sends off the response message
	function respond(code, data){
		// content header
		res.writeHead(code, {'content-type': mime.lookup(filename)|| 'text/html'});
		// write message and signal communication is complete
		res.end(data);
	}
};
