import * as functions from 'firebase-functions';
import admin = require('firebase-admin');
const serviceAccount = require('../keys/pets-app-4ad91-firebase-adminsdk-g5a3t-06168b6603.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://pets-app-4ad91.firebaseio.com"
});

import firebase = require('firebase');
const firebaseConfig = {
    apiKey: "AIzaSyBNGvsDJknLWlAT-f-J0IoYqCIyn7tfwM4",
    authDomain: "pets-app-4ad91.firebaseapp.com",
    databaseURL: "https://pets-app-4ad91.firebaseio.com",
    projectId: "pets-app-4ad91",
    storageBucket: "pets-app-4ad91.appspot.com",
    messagingSenderId: "907089114990",
    appId: "1:907089114990:web:fe58f615e736287d23b37f"
};
firebase.initializeApp(firebaseConfig);

import express = require('express');
const app = express();

app.get('/screams', (request: any, response: any) => {
    const db = admin.firestore().collection('screams');
    db.orderBy('createdDate', 'desc')
    .get()
    .then(data => {
        const screams: any[] = [];
        data.forEach(doc => {
            screams.push({
                id: doc.id,
                userHandle: doc.data().userHandle,
                body: doc.data().body,
                createdDate: doc.data().createdDate
            })
        });
        return response.json(screams);
    }).catch(error => {
        console.log(error);
    });
});


// Create a Scream
app.post('/scream', (request: any, response: any) => {

    const db = admin.firestore().collection('screams');
    const newScream : { body: string, userHandle: string, createdDate: any } = {
        body: request.body.body,
        userHandle: request.body.userHandle,
        createdDate: admin.firestore.Timestamp.fromDate(new Date())
    }

    db.add(newScream).then((doc) => {
        response.json({ 
            message : `Document ${doc.id} created Successfully`
        });
    }).catch((error) => {
        response.status(500).json({
            error: 'Something went wrong'
        });
        console.error(error);
    });
});

// Signup
app.post('/signup', (request: any, response: any) => {
    const newUser = {
        email : request.body.email,
        password: request.body.password,
        confirmPassword: request.body.confirmPassword,
        handle: request.body.handle
    };

    firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password)
        .then((data) => {
            return response.status(201).json({
                message: `user ${data.user?.uid} signed up successfully`
            });
        })
        .catch((error) => {
            console.error(error);
            return response.status(500).json({
                error: error.code
            });
        })
})

exports.api = functions.https.onRequest(app);