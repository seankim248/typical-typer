require('dotenv/config');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const errorMiddleware = require('./error-middleware');
const staticMiddleware = require('./static-middleware');
const pg = require('pg');
const { v4: uuidv4 } = require('uuid');
const rooms = new Map();

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const httpServer = http.createServer(app);
const io = new Server(httpServer);

io.on('connection', socket => {
  if (!socket.handshake.query.roomCode) {
    socket.disconnect();
    return;
  }
  const roomCode = socket.handshake.query.roomCode;
  const users = rooms.get(roomCode);
  if (users === undefined) {
    socket.disconnect();
    return;
  }
  socket.join(roomCode);

  const user = { socketId: socket.id, username: '' };
  users.push(user);

  socket.on('username-created', username => {
    user.username = username;
    io.to(roomCode).emit('user-joined', user);
    socket.to(roomCode).emit('room-joined', user);
  });

  socket.emit('players', users.filter(user => {
    return user.username !== '';
  }));
});

const jsonMiddleware = express.json();

app.use(jsonMiddleware);

app.get('/api/home', (req, res, next) => {
  const sql = `
  select "content"
      from "quotes"
      where "quoteId" = $1
  `;
  const params = [Math.floor(Math.random() * 25) + 1];
  db.query(sql, params)
    .then(result => {
      const [quote] = result.rows;
      res.status(201).json(quote);
    })
    .catch(err => {
      next(err);
    });
});

app.post('/api/room', (req, res, next) => {
  const roomCode = uuidv4();
  const users = [];
  rooms.set(roomCode, users);
  res.json({ roomCode: roomCode });
});

app.use(staticMiddleware);

app.use(errorMiddleware);

httpServer.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`express server listening on port ${process.env.PORT}`);
});
