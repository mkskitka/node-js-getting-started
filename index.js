
var express = require('express');
var app = express();
//var path = require('path');
var bodyParser = require('body-parser');
var mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/database';
var MongoClient = require('mongodb').MongoClient, format = require('util').format;
app.set('port', (process.env.PORT || 5000));
var db = MongoClient.connect(mongoUri, function(error, databaseConnection) {
	db = databaseConnection;
});


app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json());
app.use(function(req,res,next){
	res.header("Access-Control-Allow-Origin","*");
	res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept");
	next();
});
// app.listen(5000, function() { console.log('listening')});

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


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

app.post('/sendLocation', function(request, response) {
	var data = {};
	var login = request.body.login;
	var lat = parseFloat(request.body.lat);
	//console.log(request.body.lat);
	var lng = parseFloat(request.body.lng);
	//var create_at = new date();
	if(request.body.login == NULL || request.body.lat == NULL || request.body.lng == NULL){
			//response.send(500);
	}		
	var toInsert = {
		"login": login,
		"lat": lat,
		"lng": lng,
		//"created_at": created_at,
	};
	db.collection('people', function(error, coll) {
		coll.insert(toInsert, function(error, saved) {
			if (error) {
				response.send(500);
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

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


/*app.get('/', function(request, response) {
	response.set('Content-Type', 'text/html');
	var indexPage = '';
	db.collection('fooditems', function(er, collection) {
		collection.find().toArray(function(err, cursor) {
			if (!err) {
				indexPage += "<!DOCTYPE HTML><html><head><title>What Did You Feed Me?</title></head><body><h1>What Did You Feed Me?</h1>";
				for (var count = 0; count < cursor.length; count++) {
					indexPage += "<p>You fed me " + cursor[count].food + "!</p>";
				}
				indexPage += "</body></html>"
				response.send(indexPage);
			} else {
				response.send('<!DOCTYPE HTML><html><head><title>What Did You Feed Me?</title></head><body><h1>Whoops, something went terribly wrong!</h1></body></html>');
			}
		});
	});
});*/


// app.get('/lab8', function(request, response) {
//   response.send(lab8());
// });



