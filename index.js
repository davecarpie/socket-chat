var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http)

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
})

var users = {}

io.on('connection', function(socket) {

    socket.on('joined', (name) =>
    {
        users[socket.id] = {}
        users[socket.id].nick = name
        socket.broadcast.emit('user connected', name)    
    })

    socket.on('msg', function(msg) {
        var nick = users[socket.id].nick
        var data = { "sender" : nick, "text" : msg}
        socket.broadcast.emit('msg', data)
    })

    socket.on('nick', function(name) {
        let previousNick = users[socket.id].nick
        users[socket.id].nick = name
        var msg = { "sender" : null, "text" : previousNick + " changed their name to " + name }
        socket.broadcast.emit('msg', msg)
    });

    socket.on('disconnect', function() {
        console.log('user disconnected');
    })

    socket.on('typing', function(isTyping) {
        users[socket.id].typing = isTyping
        typingUsers = []
        for (userId in users) {
            if (users.hasOwnProperty[userId]) {
                if (users.userId.typing) {
                    typingUsers += [users.userId.nick]
                }
            }
        }
        io.emit('typists', typingUsers)
    })
})

http.listen(3000, function() {
    console.log('Listening on port 3k');
})