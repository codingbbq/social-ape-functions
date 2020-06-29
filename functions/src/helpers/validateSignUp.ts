export{};
import { isEmail, isEmpty } from '../helpers/utils';
import { Error, UserModel } from '../models/datatypes';

exports.ValidateSignUp = (data: UserModel) => {

    const errors: Error = {};
    if(isEmpty(data.email!)) {
        errors.email = "Email should not be empty";
    } else if( !isEmail(data.email!)) {
        errors.email = "Please usea valid email";
    }

    if(isEmpty(data.password!)) {
        errors.password = "Must not be empty";
    }

    if(data.password !== data.confirmPassword) {
        errors.password = "Passwords must match";
    }

    if(isEmpty(data.handle!)) {
        errors.handle = "Handle must not be empty";
    }

    return {
        errors : errors,
        valid : Object.keys(errors).length === 0 ? true: false
    }

}