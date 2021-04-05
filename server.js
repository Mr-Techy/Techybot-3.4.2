const express = require("express");
const server = express();

server.all("/", (req, res) => {
  res.send("Hello world! This is the main page.");
});

function keepAlive(port) {
  server.listen(port);
}

module.exports = keepAlive;
