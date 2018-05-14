var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http)

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
})

var nicks = {}

io.on('connection', function(socket) {

    socket.on('joined', (name) =>
    {
        nicks[socket.id] = name
        socket.broadcast.emit('user connected', name)    
    })

    socket.on('msg', function(msg) {
        var nick = getNick(socket.id)
        var data = { "sender" : nick, "text" : msg}
        socket.broadcast.emit('msg', data)
    })

    socket.on('nick', function(name) {
        let previousNick = nicks[socket.id]
        nicks[socket.id] = name
        var msg = { "sender" : null, "text" : previousNick + " changed their name to " + data }
        io.emit('msge', msg)
    });

    socket.on('disconnect', function() {
        console.log('user disconnected');
    })
})

http.listen(3000, function() {
    console.log('Listening on port 3k');
})