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

  const user = { socketId: socket.id, username: '', wpm: null, wordsCompleted: 0 };
  users.push(user);

  socket.on('username-created', username => {
    if (users.length === 1) {
      user.roomHost = true;
    } else {
      user.roomHost = false;
    }
    user.username = username;
    io.to(roomCode).emit('user-joined', user);
    socket.to(roomCode).emit('room-joined', user);
  });

  socket.on('start', didStart => {
    socket.to(roomCode).emit('started', didStart);
  });

  socket.emit('players', users.filter(user => {
    return user.username !== '';
  }));

  socket.on('pressed-start', startGame => {
    socket.emit('startGame', startGame);
  });

  socket.on('wpm', wpm => {
    user.wpm = wpm;
    io.to(roomCode).emit('user-wpm', user);
  });

  socket.on('completed-words', words => {
    user.wordsCompleted = words;
    io.to(roomCode).emit('user-words-completed', user);
  });

  socket.on('reset', () => {
    for (let i = 0; i < users.length; i++) {
      users[i].wordsCompleted = 0;
      users[i].wpm = null;
    }
    io.to(roomCode).emit('user-reset', users);
  });
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

app.post('/api/start/:roomId', (req, res, next) => {
  let count = 3;
  const countDown = setInterval(() => {
    if (count === 0) {
      clearInterval(countDown);
    }
    io.to(req.params.roomId).emit('start-countdown', count);
    count -= 1;
  }, 1000);
  const sql = `
  select "content"
      from "quotes"
      where "quoteId" = $1
  `;
  const params = [26];
  db.query(sql, params)
    .then(result => {
      const [quote] = result.rows;
      io.to(req.params.roomId).emit('start', quote, true);
      res.json();
    })
    .catch(err => {
      next(err);
    });
});

app.use(staticMiddleware);

app.use(errorMiddleware);

httpServer.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`express server listening on port ${process.env.PORT}`);
});
