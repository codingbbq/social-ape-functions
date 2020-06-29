export{};
import * as functions from 'firebase-functions';

// API Endpoints
const { GetScreams } = require('./endpoints/GetScreams');
const { PostScream } = require('./endpoints/PostScream');
const { SignUp } = require('./endpoints/SignUp');
const { Login } = require('./endpoints/Login');
const { FBAuth } = require('./endpoints/FBAuth');


import firebase = require('firebase');
const firebaseConfig = require('../keys/firebaseConfig.json');
firebase.initializeApp(firebaseConfig);

const app = require('express')();


app.get('/screams', GetScreams);

// Create a Scream
app.post('/scream', FBAuth, PostScream);

// Signup
app.post('/signup', SignUp);

// Login API
app.post('/login', Login);

exports.api = functions.https.onRequest(app);