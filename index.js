const express = require('express');
const socketIO = require('socket.io');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(express.static('public'));

const server = app.listen(8080);
const io = socketIO(server);

app.get('/', (req, res) => {
    return res.sendFile(path.join(__dirname, 'index.html'));
});

io.on('connection', socket => {
    const imgFolderPath = path.join(__dirname, 'images');

    let imgCount = 0;

    socket.on('image', imageData => {
        const imgData = Buffer.from(imageData.replace(/^data:image\/\w+;base64,/, ''), 'base64');
        const imgFileName = `image-${imgCount++}.jpg`;

        fs.writeFile(path.join(imgFolderPath, imgFileName), imgData, err => {
            if (err) {
                console.error(err);
                return;
            }

            console.log(`Image saved: ${imgFileName}`);
        });
    });

    socket.on('disconnect', () => {
        console.log('client disconnected');
    });
});