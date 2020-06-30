export{}

const { reduceUserDetails } = require('../helpers/ValidUserDetails');
const { db } = require('../helpers/admin');

exports.UserDetails = (request: any, response: any) => {
    const userDetails: any = reduceUserDetails(request.body);

    db.doc(`/users/${request.user.handle}`).update(userDetails)
    .then(() => {
        return response.json({
            message: 'Details added successfully'
        });
    })
    .catch((error: any) => {
        return response.status(500).json({
            error: error.code
        });
    });
}