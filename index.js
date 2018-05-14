var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http)

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
})

var nicks = {}

let getNick = function(id) {
    if (nicks.id) {
        return nicks.id
    } else {
        return (id.substring(id.length - 5));
    }
}

io.on('connection', function(socket) {
    console.log('a user connected');
    socket.broadcast.emit('user connected')

    socket.on('chat message', function(msg) {
        console.log(msg);
        var nick = getNick(socket.id)
        var data = { "sender" : nick, "msg" : msg}
        socket.broadcast.emit('chat message', data)
    })

    

    socket.on('nick', function(data) {
        console.log("new nick" + data)
        let previousNick = getNick(socket.id)
        nicks[socket.id] = data
        var msg = { "sender" : null, "msg" : previousNick + " changed their name to " + data }
        io.emit('chat message', msg)
    });

    socket.on('disconnect', function() {
        console.log('user disconnected');
    })
})

http.listen(3000, function() {
    console.log('Listening on port 3k');
})