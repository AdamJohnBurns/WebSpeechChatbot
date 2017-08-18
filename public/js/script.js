// chrome currently uses prefixed name
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

const socket = io(); // already included on page, so assume available

// optional
recognition.lang = 'en-US';
recognition.interimResults = false;

// clicking the button triggers recognition
document.querySelector('button').addEventListener('click', () => {
  recognition.start();
});

// when recognition returns a result, a 'result' event is fired
recognition.addEventListener('result', (event) => {
  let last = event.results.length - 1;
  let text = event.results[last][0].transcript;
  let confidence = event.results[0][0].confidence);

  // send the transcribed text to the express server via web sockets
  socket.emit('chat message', text);
  console.log('User Message: ' + text);
});

// helper function to generate synthetic voice
function speakText (text) {
  const synth = window.speechSynthesis; // better supported than speech recognition, no prefix needed

  const utterance = new SpeechSynthesisUtterance();

  utterance.text = text;

  synth.speak(utterance);
}

// when getting a response from the server
socket.on('bot reply', function (replyText) {
  synthVoice(replyText);
  console.log('Bot Message: ' + replyText);
});
