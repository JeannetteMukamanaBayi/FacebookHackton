/*Group Rw1 fse emergency network*/
/*This the main engine of the esn project**/
/*created at 1:19 AM CAT 2/16/2018**/
/****happy coding guys **********/

/*
 Definition of required node modules/resources/variables
1.Express:
2.routes:
3.bodyparser:
4.Session:
5.session:
6.socket:
*/

var express = require('express');
var app = express();
var path = require('path');
var routes = require('./routes.js');
var session = require('express-session');
var server = require('http').createServer(app);

var port = process.env.PORT || 8000;
server.listen(port, function () {
        console.log('Server listening at port %d', port);
});

var io = require('socket.io')(server);


/*
Setting ejs as the base template
*/
app.set('view engine', 'ejs');

/*
  Setting the routes
*/
app.use('/', routes);


/*
Setting the static folder
*/

app.use(express.static('public'));

/*
Defining the server port and socket
*/


module.exports.socketio = io
