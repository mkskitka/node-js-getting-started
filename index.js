
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

app.use(function(req,res,next){
	res.header("Access-Control-Allow-Origin","*");
	res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept");
	next();
});



app.post('/sendLocation', function(request, response) {
	
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
										data.landmarks = cursor;
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

app.get('/', function(request, response) {
	response.set('Content-Type', 'text/html');
	var indexPage = '';
	db.collection('people', function(err, coll) {
		if(!err){
			coll.find().toArray(function(err, cursor) { //fixSort
				if(cursor){
					indexPage += "<!DOCTYPE HTML><html><head><title>Checkins</title></head><body><h1>Checkins</h1>";
					for (var count = 0; count < cursor.length; count++) {
							indexPage += "<p> " + cursor[count].login + " checked in at " + cursor[count].lat + ", " + cursor[count].lng + " on " +  cursor[count].created_at  + "</p>";
						
					}
					indexPage += "</body></html>"
					response.send(indexPage);
				}
				else{
					response.send('<!DOCTYPE HTML><html><head><title>Something is wrong with your data</title></head><body><h1>Whoops, something went terribly wrong!</h1></body></html>');
				}	
			});
		}
	});
});

app.get('/checkins.json', function(request, response){
	//response.set('Content-Type', )
	var data = new Array();
	var url = require('url');
	var url_parts = url.parse(request.url, true);
	var query = url_parts.query;

	if(query.login == undefined){
		response.send(data)
	}
	db.collection('people', function(error, coll){
		if(!error){
			coll.find().toArray(function(err, cursor){
				if(cursor){
					for (var count = 0; count < cursor.length; count++) {
						if(cursor[count].login == query.login){
							data[data.length] = cursor[count];
						}
					}
					response.send(data);
				}
				else{
					response.send(data);
				}
			});
		}	
	});
});

app.set('port', 5000);
app.listen(process.env.PORT || 5000, function() { console.log('listening on port 5000')});




