var express = require('express');
var request = require('request');
var querystring = require('querystring');
var cookies = require('cookie-parser');
var login = require('./routes/login');
var artists = require('./routes/artists');
var activities = require('./routes/activities');
var concerts = require('./routes/concerts');
var auth_callback = require('./routes/auth_callback');
var refresh_token = require('./routes/refresh_token');

var settings = {
  client_id: '04401f9d07b94eb8b5b2f4e375530692',
  client_secret: '4ae5c6d5c0c1452f8e85d8114c169598',
  redirect_uri: 'http://localhost:8888/auth_callback',
  scope: 'user-library-read'
};

function allow(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
}

var app = express();
app.use(allow);
app.use(express.static(__dirname + '/public'));
app.use(cookies());
app.use(login(settings));
app.use(artists());
app.use(activities());
app.use(concerts());
app.use(auth_callback(settings, login));
app.use(refresh_token(settings));

console.log('Listening on 8888');
app.listen(8888);
