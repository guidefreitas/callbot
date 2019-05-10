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
 