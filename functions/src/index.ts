import * as functions from 'firebase-functions';
import admin = require('firebase-admin');
import { User, Error } from './models/datatypes';
import { isEmail, isEmpty } from './helpers/utils';

const serviceAccount = require('../keys/serviceaccount.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://pets-app-4ad91.firebaseio.com"
});

import firebase = require('firebase');
const firebaseConfig = require('../keys/firebaseConfig.json');
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

    const errors: Error = {};


    if(isEmpty(newUser.email)) {
        errors.email = "Email should not be empty";
    } else if( !isEmail(newUser.email)) {
        errors.email = "Please usea valid email";
    }

    if(isEmpty(newUser.password)) {
        errors.password = "Must not be empty";
    }

    if(newUser.password !== newUser.confirmPassword) {
        errors.password = "Passwords must match";
    }

    if(isEmpty(newUser.handle)) {
        errors.handle = "Handle must not be empty";
    }

    if(Object.keys(errors).length > 0){
        response.status(400).json(errors);
    }

    const db = admin.firestore();
    let token: any;
    let userId: any;
        db.doc(`/users/${newUser.handle}`)
        .get()
        .then((doc) => {
            console.log(doc);
            if(doc.exists) {
                return response.status(400).json({
                    handle: "This handle is already taken"
                })
            }else {
                return firebase
                .auth()
                .createUserWithEmailAndPassword(newUser.email, newUser.password);
            }
        })
        .then((data) => {
            userId = data.user?.uid;
            return data.user?.getIdToken();
        })
        .then((tokenId) => {
            token = tokenId;
            const userCredentials = {
                handle : newUser.handle,
                email: newUser.email,
                createdDate: new Date().toISOString(),
                userId
            }

            return db.doc(`/users/${newUser.handle}`).set(userCredentials);
        })
        .then(() => {
            return response.status(201).json({
                token
            });
        })
        .catch((error) => {
            console.error(error);
            if( error.code === 'auth/email-already-in-use') {
                return response.status(400).json({
                    email: "Email already in use"
                });
            }else {
                return response.status(500).json({
                    error: error.code  
                });
            }
        })
    });

// Login API
app.post('/login', (request: any, response: any) => {
    // ToDo : Create a user infreface
    const user: User = {
        email: request.body.email,
        password: request.body.password
    }

    // ToDo : Create a errors interface
    const errors: Error = {};

    if(isEmpty(user.email)) {
        errors.email = "Must not be empty";
    }

    if(isEmpty(user.password)) {
        errors.password = "Must not be empty;"
    }

    if(Object.keys(errors).length > 0) {
        return response.status(400).json({
            errors
        });
    }

    firebase
        .auth()
        .signInWithEmailAndPassword(user.email, user.password)
        .then((data) => {
            return data.user?.getIdToken();
        })
        .then((idToken) => {
            return response.json({ idToken});
        })
        .catch((error) => {
            console.error(error);
            if(error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
                return response.status(403).json({
                    error : "username or password incorrect"
                });
            } else {
                return response.status(500).json({
                    error: error.code
                });  
            }
        });
})

exports.api = functions.https.onRequest(app);