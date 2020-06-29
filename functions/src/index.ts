import * as functions from 'firebase-functions';
const { admin, db } = require('./helpers/admin');

// API Endpoints
const { GetScreams } = require('./endpoints/GetScreams');
const { PostScream } = require('./endpoints/PostScream');
const { SignUp } = require('./endpoints/SignUp');
const { Login } = require('./endpoints/Login');


import firebase = require('firebase');
const firebaseConfig = require('../keys/firebaseConfig.json');
firebase.initializeApp(firebaseConfig);

const app = require('express')();


app.get('/screams', GetScreams);

const FBAuth = (request: any, response: any, next: any) => {
    let idToken;
    if(request.headers.authorization && request.headers.authorization.startsWith('Bearer ')) {
        idToken = request.headers.authorization.split('Bearer ')[1];
    } else {
        console.error("No token found");
        return response.status(401).json({
            error: 'Unauthorized'
        });
    }

    admin.auth().verifyIdToken(idToken)
        .then((decodedToken: string) => {
            request.user = decodedToken;
            console.log(decodedToken);
            return db
            .collection('users')
            .where('userId', '==', request.user.uid)
            .limit(1)
            .get();
        })
        .then((data: any) => {
            request.user.handle = data.docs[0].data().handle;
            return next();
        })
        .catch((error: any) => {
            console.error("Error verifying the token", error);
            return response.status(403).json(error);
        });
}

// Create a Scream
app.post('/scream', FBAuth, PostScream);

// Signup
app.post('/signup', SignUp);

// Login API
app.post('/login', Login);

exports.api = functions.https.onRequest(app);