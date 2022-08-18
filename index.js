const { readFileSync } = require('fs');
const { createServer } = require('http');
const { Server } = require('socket.io');

const httpServer = createServer((req, res) => {
  if (req.url !== '/') {
    res.writeHead(404);
    res.end('Not found');
    return;
  }
  // reload the file every time
  const content = readFileSync('index.html');
  const length = Buffer.byteLength(content);

  res.writeHead(200, {
    'Content-Type': 'text/html',
    'Content-Length': length,
  });
  res.end(content);
});

const io = new Server(httpServer, {
  // Socket.IO options
});

io.on('connection', (socket) => {
  console.log(`connect ${socket.id}`);

  socket.on('disconnect', (reason) => {
    console.log(`disconnect ${socket.id} due to ${reason}`);
  });
});

let colour = 'red';

setInterval(() => {
  console.log('emit blink');
  io.emit('blink-now', { timeToGlowInMs: 200, colour: colour });
}, 1000);

httpServer.listen(3000);
