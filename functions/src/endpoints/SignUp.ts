export{};
const firebaseConfig = require('../../keys/firebaseConfig.json');
import { UserModel } from '../models/datatypes';
const { ValidateSignUp } = require('../helpers/validateSignUp');

const { db } = require('../helpers/admin');
import firebase = require('firebase');

exports.SignUp = (request: any, response: any) => {
    const newUser: UserModel = {
        email : request.body.email,
        password: request.body.password,
        confirmPassword: request.body.confirmPassword,
        handle: request.body.handle
    };

    const { valid, errors } = ValidateSignUp(newUser);

    if(!valid) {
        response.status(400).json(errors);
    }
    
    const noImg: string = 'noImg.jpg';
    let token: any;
    let userId: any;
        db.doc(`/users/${newUser.handle}`)
        .get()
        .then((doc: any) => {
            console.log(doc);
            if(doc.exists) {
                return response.status(400).json({
                    handle: "This handle is already taken"
                })
            }else {
                return firebase
                .auth()
                .createUserWithEmailAndPassword(newUser.email!, newUser.password!);
            }
        })
        .then((data: any) => {
            userId = data.user?.uid;
            return data.user?.getIdToken();
        })
        .then((tokenId: string) => {
            token = tokenId;
            const userCredentials = {
                handle : newUser.handle,
                email: newUser.email,
                createdAt: new Date().toISOString(),
                userId,
                imageUrl : `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/${noImg}?alt=media`
            }

            return db.doc(`/users/${newUser.handle}`).set(userCredentials);
        })
        .then(() => {
            return response.status(201).json({
                token
            });
        })
        .catch((error: any) => {
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
    }