export{};
import { isEmpty } from '../helpers/utils';
import { Error, User } from '../models/datatypes';

exports.ValidateLogin = (user: User) => {

    const errors: Error = {};

    if(isEmpty(user.email)) {
        errors.email = "Must not be empty";
    }

    if(isEmpty(user.password)) {
        errors.password = "Must not be empty;"
    }

    return {
        errors: errors,
        valid : Object.keys(errors).length === 0 ? true: false
    }

}