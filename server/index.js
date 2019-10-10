'use strict';

const express = require('express');
const Docker = require('dockerode');
const docker = new Docker({ socketPath: '/var/run/docker.sock' });

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();

app.get('/', (req, res) => {
  res.send('Welcome to skitter!\n');
});

app.get('/demo', (req, res) => {
  docker.run('skitter/worker', ['node', 'demo'], res);
});

app.get('/instagram/post/:shortcode', (req, res) => {
  const { params } = req;
  const { shortcode } = params;
  docker.run('skitter/worker', ['node', 'instagram/post', shortcode], res);
});

app.get('/instagram/feed/:handle/:count?', (req, res) => {
  const { params } = req;
  const { handle, count } = params;
  docker.run('skitter/worker', ['node', 'instagram/feed', handle, `${count || 20}`], res);
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
