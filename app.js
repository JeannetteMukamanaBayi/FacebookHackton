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

// Chatroom

var numUsers = 0;
var onlineUsers = [];

io.on('connection', function (socket) {
        var addedUser = false;
        // when the client emits 'add user', this listens and executes


        socket.on('add user', function (username) {
                if (addedUser) return;

                // we store the username in the socket session for this client
                socket.username = username;
                ++numUsers;
                addedUser = true;

                var user = {
                        username: socket.username,
                        'socket_id': socket.id
                }
                onlineUsers.push(user);

                socket.emit('login', {
                        numUsers: numUsers
                });
                // echo globally (all clients) that a person has connected
                socket.broadcast.emit('user joined', {
                        username: socket.username,
                        numUsers: numUsers
                });

                console.log("new user at App.js: "+socket.username + "the new socket id: " + socket.id)

        });

        // when the client emits 'new message', this listens and executes
        socket.on('NewPrivateMessage', function (data) {
                // we tell the client to execute 'new message'

                console.log("\nHitting server socket emit:\n "+JSON.stringify(data))

                var target = data.target;

                for (let user in onlineUsers) {
                        if (onlineUsers[user].username === target) {
                                socketid = onlineUsers[user].socket_id;
                                io.to(socketid).emit('NewPrivateMessage', data);
                                console.log("\nSending emit to:\n "+onlineUsers[user].username + " socket id: " +socketid);
                                socketid = '';
                        }
                }
                
        });

});

module.exports.socketio = io
