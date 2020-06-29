export{};

import firebase = require('firebase');

// Interfaces
import { User } from '../models/datatypes';

const { ValidateLogin } = require('../helpers/validateLogin');

exports.Login = (request: any, response: any) => {

    const user: User = {
        email: request.body.email,
        password: request.body.password
    }

    const { valid, errors } = ValidateLogin(user);

    if(!valid) {
        return response.stats(400).json(errors);
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
}