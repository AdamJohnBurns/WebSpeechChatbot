const express = require('express');
const app = express();

app.use(express.static(__dirname + '/views')); // HTML path
app.use(express.static(__dirname + '/public')); // js, css, img

const server = app.listen(5000);

app.get('/', (req, res) => {
  res.sendFile('index.html');
})

// conect socket.io to server
const io = require('socket.io')(server);

const API_KEY = require('./apiKey.js'); // api token from site
const SESSION_ID = '00001';
const apiai = require('apiai')(API_KEY);

// when we get a socket connection
io.on('connection', function (socket) {
  console.log('> connection');

  // when we receive a 'chat message' emit
  socket.on('chat message', (text) => {
    console.log('> chat message');

    // make a request to the apiAi service
    let apiaiReq = apiai.textRequest(text, {
      sessionId: SESSION_ID
    });

    // when we receive a response from the service
    apiaiReq.on('response', (response) => {
      // receive a text response
      let aiText = response.result.fulfillment.speech;

      // emit response back
      socket.emit('bot reply', aiText);
    });

    // when we receive an error from the service
    apiaiReq.on('error', (error) => {
      // output the error
      console.log(error);
    });

    // end this request
    apiaiReq.end();
  });

});
