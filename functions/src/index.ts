export{};
import * as functions from 'firebase-functions';

// API Endpoints
const { GetScreams } = require('./endpoints/GetScreams');
const { GetScream } = require('./endpoints/GetScream');
const { PostScream } = require('./endpoints/PostScream');
const { SignUp } = require('./endpoints/SignUp');
const { Login } = require('./endpoints/Login');
const { FBAuth } = require('./endpoints/FBAuth');
const { UploadImg } = require('./endpoints/UploadImg');
const { UserDetails } = require('./endpoints/UserDetails');
const { GetAuthUserDetails } = require('./endpoints/GetAuthUserDetails');
const { CommentOnScream } = require('./endpoints/CommentOnScream');

import firebase = require('firebase');
const firebaseConfig = require('../keys/firebaseConfig.json');
firebase.initializeApp(firebaseConfig);

const app = require('express')();

app.get('/screams', GetScreams);

// Create a Scream
app.post('/scream', FBAuth, PostScream);

// Get Scream
app.get('/screams/:screamId', GetScream);

// Delete scream

// Like a Scream

// Unlike a Scream

// Comment on Scream
app.post('/screams/:screamId/comment', FBAuth, CommentOnScream);

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