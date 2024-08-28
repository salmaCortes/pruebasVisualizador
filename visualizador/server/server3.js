const express = require('express');
const request = require('request');
const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/shared', (req, res) => {
  const url = `http://192.168.1.87/shared/${req.url}`;
  req.pipe(request(url)).pipe(res);
});

app.listen(3001, () => {
  console.log('Proxy server running on port 3001');
});
