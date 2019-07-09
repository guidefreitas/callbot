const functions = require('firebase-functions');
const admin = require('firebase-admin');
const request = require('request');

admin.initializeApp(functions.config().firebase);

const FIREBASE_URL = 'https://hooks.slack.com/services/...';

exports.status = functions.https.onRequest((request, response) => {
  admin.database().ref('/call').once('value', (snapshot) => {
    response.send(snapshot.val().status.toString());
  });
});

exports.status_str = functions.https.onRequest((request, response) => {
  admin.database().ref('/call').once('value', (snapshot) => {
    if(snapshot.val().status === 1) {
      response.send("Shh! Tem gente em call!");
    } else {
      response.send("Ninguém em call");
    }
  });
});

exports.activate = functions.https.onRequest((request, response) => {
  admin.database().ref('/call').set({
    status: 1,
    username: '',
    activatedAt: null,
  });
  response.send("ok");
});
 
exports.deactivate = functions.https.onRequest((request, response) => {
  admin.database().ref('/call').set({
    status: 0,
    username: '',
    activatedAt: null,
  });
  response.send("ok");
});

function getCommandHelp() {
  return `O comando deve ser:
/callbot start - Inicia o callbot
/callbot stop - Encerra o callbot
/callbot who - Mostra quem está em call 
`;
}

function startCallbot(username) {
  admin.database().ref('/call').set({
    status: 1,
    username: username,
    activatedAt: Date.now(),
  });
}

function stopCallbot() {
  admin.database().ref('/call').set({
    status: 0,
    username: '',
    activatedAt: null,
  });
}

function sendSlackMessage(data) {
  const msgPayload = {
    channel: `@${data.username}`,
    as_user: 'callbot',
    text: 'Você ainda está em call? Se não estiver, lembre-se de desativar o callbot com /callbot stop'
  }

  const payloadJson = JSON.stringify(msgPayload);

  const options = {
    url: FIREBASE_URL,
    headers: {
       'Content-Type': 'application/json',
    },
    body: payloadJson,
  }

  request.post(options);
}

function notifyCaller(data) {
  if(data.status === 1 && data.activatedAt !== null) {
      const activatedHours = new Date(data.activatedAt).getHours();
      const currentHours = new Date().getHours();

      if(currentHours - activatedHours > 1) {
        sendSlackMessage(data);
      }
  }
}

exports.scheduledFunction = functions.pubsub.schedule('every 20 minutes').onRun((context) => {
  admin.database().ref('/call').once('value', (snapshot) => {
    notifyCaller(snapshot.val());
  });
});

function verifyCaller(response) {
  admin.database().ref('/call').once('value', (snapshot) => {
    if(snapshot.val().status === 1) {
      const username = snapshot.val().username;
      response.send(`Shh! O mochileiro(a) ${username} está em call!`);
    } else {
      response.send('Ninguém em call');
    }
  });
}

exports.call = functions.https.onRequest((request, response) => {

  var commandText =  request.body.text;

  switch(commandText) {
    case 'start': startCallbot(request.body.user_name);
                  response.send('Callbot ligado');
                  break;
    
    case 'stop': stopCallbot();
                 response.send('Callbot desligado');
                 break;
    
    case 'who': verifyCaller(response);
                break;
    
    default: response.send(getCommandHelp());
  }
});
 
