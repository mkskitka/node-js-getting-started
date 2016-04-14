
var express = require('express');
var app = express();

//var path = require('path');
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json());

var mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/database';
var MongoClient = require('mongodb').MongoClient, format = require('util').format;
var db = MongoClient.connect(mongoUri, function(error, databaseConnection) {
	db = databaseConnection;
});




app.use(function(req,res,next){
	res.header("Access-Control-Allow-Origin","*");
	res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept");
	next();
});
app.listen(5000, function() { console.log('listening on port 5000')});

// views is directory for all template files
//app.set('views', __dirname + '/views');
//app.set('view engine', 'ejs');


// response.sendFile(_dirname + 'public/home.html')
/*app.get('/', function(request, response) {
  response.sendFile(path.join(__dirname + '/public/home.html'));
});
*/
/*
app.get('/db', function (request, response) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('SELECT * FROM test_table', function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       { response.render('pages/db', {results: result.rows} ); }
    });
  });
})
*/
app.use(express.static(__dirname + '/public'));

app.post('/sendLocation', function(request, response) {
	var data = {};
	var login = request.body.login;
	var lat = parseFloat(request.body.lat);
	var lng = parseFloat(request.body.lng);
	var create_at = new Date();
	if(request.body.login == undefined || request.body.lat == undefined || request.body.lng == undefined){
			//response.send(500);
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
				response.send("error 1");
			}
			else {
				db.collection.find().toArray(function(err, cursor) {
					if(!err){
						data.people = cursor;
						db.collection('landmarks', function (error, coll) {
							if(!error){
								db.collection.find().toArray(function (err, cursor) {
									if(!err){
										data.landmarks = cursor;
										response.send(data);
									}
									else{
										response.send("error 3");
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




/*app.get('/', function(request, response) {
	response.set('Content-Type', 'text/html');
	var indexPage = '';
	db.collection('people', function(er, collection) {
		if(!err){
		collection.find().toArray(function(err, cursor) {

				indexPage += "<!DOCTYPE HTML><html><head><title>Checkins</title></head><body><h1>Checkins</h1>";
				for (var count = 0; count < cursor.length; count++) {
					if(response.body.login == cursor[count].people.login){
						indexPage += "<p> " + cursor[count].people.created_at + " " + cursor[count].people.lat + " " cursor[count].people.lng + " " + cursor[count].people.login + "!</p>";
					}
				}
				indexPage += "</body></html>"
				response.send(indexPage);
			} else {
				response.send('<!DOCTYPE HTML><html><head><title>Something is wrong with your data</title></head><body><h1>Whoops, something went terribly wrong!</h1></body></html>');
			}
		});
	});
});

*/
//app.set('port', (process.env.PORT || 5000));
//console.log("now running port 5000")

// app.get('/lab8', function(request, response) {
//   response.send(lab8());
// });



