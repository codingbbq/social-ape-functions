export{};
import * as functions from 'firebase-functions';

// API Endpoints
const { GetScreams } = require('./endpoints/GetScreams');
const { PostScream } = require('./endpoints/PostScream');
const { SignUp } = require('./endpoints/SignUp');
const { Login } = require('./endpoints/Login');
const { FBAuth } = require('./endpoints/FBAuth');
const { UploadImg } = require('./endpoints/UploadImg');
const { UserDetails } = require('./endpoints/UserDetails');
const { GetAuthUserDetails } = require('./endpoints/GetAuthUserDetails');

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

// Upload image
app.post('/users/image', FBAuth, UploadImg);

// User details
app.post('/user', FBAuth, UserDetails);

// Get Own User details
app.get('/user', FBAuth, GetAuthUserDetails);

exports.api = functions.https.onRequest(app);