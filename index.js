
var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 6000));
app.use(express.static(__dirname + '/public'));
app.listen(6000, function() { console.log('listening')});

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// response.sendFile(_dirname + 'public/home.html')
app.get('/', function(request, response) {
  response.sendFile('home.html');
});

// app.get('/lab8', function(request, response) {
//   response.send(lab8());
// });

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


