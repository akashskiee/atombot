'use strict';

const APIAI_TOKEN = "9bb95b6e0e9f4082a1d6f385b414eea4";
const APIAI_SESSION_ID = "agfsfiuyaggfajhgasdjfgaa";

const express = require('express');
const app = express();

app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/assets'));

const server = app.listen(process.env.PORT || 5000, () => {
  console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});

const io = require('socket.io')(server);
io.on('connection', function(socket){
  console.log('a user connected');
});

const dialogflow = require('apiai')(APIAI_TOKEN);


app.get('/', (req, res) => {
  res.sendFile('index.html');
});

io.on('connection', function(socket) {
  socket.on('chat message', (text) => {
    console.log('Message: ' + text);


    let apiaiReq = dialogflow.textRequest(text, {
      sessionId: APIAI_SESSION_ID
    });

    apiaiReq.on('response', (response) => {
      let aiText = response.result.fulfillment.speech;
      console.log('Bot reply: ' + aiText);
      socket.emit('bot reply', aiText);
    });

    apiaiReq.on('error', (error) => {
      console.log(error);
    });

    apiaiReq.end();

  });
});