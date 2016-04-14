
var express = require('express');
//var path = require('path');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 


var mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://heroku_hrlt9p2b:ciu3131gcbehkjlr1cuiatdd1d@ds023550.mlab.com:23550/heroku_hrlt9p2b';

var MongoClient = require('mongodb').MongoClient, format = require('util').format;
var db = MongoClient.connect(mongoUri, function(error, databaseConnection) {
	db = databaseConnection;
});


console.log("beginning of file");

app.use(function(req,res,next){
	res.header("Access-Control-Allow-Origin","*");
	res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept");
	next();
});

console.log("hello");

app.get("/", function(request, response){
	console.log("in get function");
	response.send(200);

});

console.log("right before fungion");
app.post('/sendLocation', function(request, response) {
	
	console.log("in the function");


	var data = {};
	var login = request.body.login;
	var lat = parseFloat(request.body.lat);
	var lng = parseFloat(request.body.lng);
	var created_at = new Date();
	if(request.body.login == undefined || request.body.lat == undefined || request.body.lng == undefined){
			response.send(500);
	}		
	var toInsert = {
		"login": login,
		"lat": lat,
		"lng": lng,
		"created_at": created_at,
	};
	db.collection('people', function(error, coll) {
		coll.insert(toInsert, function(error, saved) {
			if (error) {
				response.send(500);
			}
			else {
				coll.find().toArray(function(err, cursor) {
					if(!err){
						data.people = cursor;
						db.collection('landmarks', function (error, coll) {
							if(!error){
								coll.find().toArray(function (err, cursor) {
									if(!err){
										console.log("about to send data");
										data.landmarks = cursor;
										//console.log(data);
										response.send(data);
									}
									else{
										response.send(500);
									}

								});
							}
						}); 
					}
				});
			} 
	    });
	});
});


app.set('port', 5000);
app.listen(process.env.PORT || 5000, function() { console.log('listening on port 5000')});


app.get('/', function(request, response) {
	response.set('Content-Type', 'text/html');
	var indexPage = '';
	db.collection('people', function(er, collection) {
		if(!err){
		collection.find().toArray(function(err, cursor) {
			if(cursor){
				indexPage += "<!DOCTYPE HTML><html><head><title>Checkins</title></head><body><h1>Checkins</h1>";
				for (var count = 0; count < cursor.length; count++) {
					if(response.body.login == cursor[count].people.login){
						indexPage += "<p> " + cursor[count].people.created_at + " " + cursor[count].people.lat + " " cursor[count].people.lng + " " + cursor[count].people.login + "!</p>";
					}
				}
				indexPage += "</body></html>"
				response.send(indexPage);
			}
			else{
				response.send('<!DOCTYPE HTML><html><head><title>Something is wrong with your data</title></head><body><h1>Whoops, something went terribly wrong!</h1></body></html>');
			}	
		} else {
			response.send('<!DOCTYPE HTML><html><head><title>Something is wrong with your data</title></head><body><h1>Whoops, something went terribly wrong!</h1></body></html>');
		}
		});
	});
});

//console.log("now running port 5000")

// app.get('/lab8', function(request, response) {
//   response.send(lab8());
// });



