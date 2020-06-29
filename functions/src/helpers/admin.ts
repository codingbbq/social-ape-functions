import admin = require('firebase-admin');
const serviceAccount = require('../../keys/serviceaccount.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://pets-app-4ad91.firebaseio.com"
});

const db = admin.firestore();

module.exports = { admin, db };