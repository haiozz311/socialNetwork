require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')
const path = require('path')
const corsConfig = require('./config/cors.config');
const { Socket } = require('socket.io');
const SocketServer = require('./SocketServer');
const { ExpressPeerServer, PeerServer } = require('peer')



const app = express()
app.use(express.json())
app.use(cors(corsConfig));
app.use(cookieParser())
app.use(fileUpload({
    useTempFiles: true
}))

// Socket
const http = require('http').createServer(app)
const io = require('socket.io')(http)


io.on('connection', socket => {
    console.log(socket.id + ' connect')
    SocketServer(socket)
})


// Routes
app.use('/user', require('./routes/userRouter'));
app.use('/api', require('./routes/upload'));
app.use('/api', require('./routes/sentence'));
app.use('/api', require('./routes/common'));
app.use('/api', require('./routes/flashcard'));
app.use('/api', require('./routes/word'));
app.use('/api', require('./routes/blog'));
app.use('/api', require('./routes/game'));
app.use('/api', require('./routes/highscore'));
app.use('/api', require('./routes/postRouter'));
app.use('/api', require('./routes/commentRouter'));
app.use('/api', require('./routes/notifyRouter'))
app.use('/api', require('./routes/messageRouter'))

// Create peer server
PeerServer({ port: 3001 , path: '/' })

// Connect to mongodb
const URI = process.env.MONGODB_URL
mongoose.connect(URI, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
}, err => {
    if (err) throw err;
    console.log("Connected to mongodb")
})

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'))
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'))
    })
}



const PORT = process.env.PORT || 5000
http.listen(PORT, () => {
    console.log('Server is running on port', PORT)
})