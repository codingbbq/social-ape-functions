export{};
import { isEmail, isEmpty } from '../helpers/utils';
import { Error } from '../models/datatypes';
const { db } = require('../helpers/admin');
import firebase = require('firebase');

exports.SignUp = (request: any, response: any) => {
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
                .createUserWithEmailAndPassword(newUser.email, newUser.password);
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
                userId
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