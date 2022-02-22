require('dotenv/config');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const errorMiddleware = require('./error-middleware');
const staticMiddleware = require('./static-middleware');
const pg = require('pg');

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const httpServer = http.createServer(app);
const io = new Server(httpServer);

io.on('connection', socket => {
  socket.on('create-room', string => {

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
  const params = [Math.floor(Math.random() * 20) + 1];
  db.query(sql, params)
    .then(result => {
      const [quote] = result.rows;
      res.status(201).json(quote);
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
