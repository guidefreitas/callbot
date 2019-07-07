const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

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
  });
  response.send("ok");
});
 
exports.deactivate = functions.https.onRequest((request, response) => {
  admin.database().ref('/call').set({
    status: 0,
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
  });
}

function stopCallbot() {
  admin.database().ref('/call').set({
    status: 0,
    username: '',
  });
}

function verifyCaller(response) {
  admin.database().ref('/call').once('value', (snapshot) => {
    if(snapshot.val().status === 1) {
      response.send(`Shh! O mochileiro(a) ${snapshot.val().username} está em call!`);
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
 
