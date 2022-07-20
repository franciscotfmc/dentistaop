'use strict';

const express = require('express');
const livereload = require('livereload');
const connectLivereload = require('connect-livereload');

const indexData = {
  cssIndex: 'index.css',
  jsIndex: 'main.js',
  title: 'Dentista em Ouro Preto [Desenvolvimento]',
  GA: false
};

const port = 3000;
const distPath = `${__dirname}/../../dist`;
const publicPath = `${__dirname}/../public`;
const viewsPath = `${__dirname}/../views`;

const app = express();

app.use(connectLivereload());

app.set('view engine', 'ejs');
app.set('views', viewsPath);

app.use(express.static(publicPath));

app.get('/', function (req, res) {
  res.render('index', indexData);
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server listening on port ${port}`)
});

const liveReloadServer = livereload
  .createServer({
    usePolling: true,
    extraExts: ['ejs']
  });

liveReloadServer
  .watch([publicPath, viewsPath]);

liveReloadServer.server.once('connection', () => {
  setTimeout(() => {
    liveReloadServer.refresh('/');
  }, 100);
});