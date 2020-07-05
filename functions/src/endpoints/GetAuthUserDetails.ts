export{}

const { db } = require('../helpers/admin');

exports.GetAuthUserDetails = (request: any, response: any) => {
    const userData: any = {};
    db.doc(`/users/${request.user.handle}`)
    .get()
    .then((doc: any) => {
        if(doc.exists) {
            userData.credentials = doc.data();
            return db.collection('likes')
                    .where('handle', '==', request.user.handle)
                    .get()

        }
    })
    .then((data: any) => {
        userData.likes = [];
        data.forEach((doc: any) => {
            userData.likes.push(doc.data())
        });
        return response.json(userData);
    })
    .catch((error: any) => {
        console.error(error);
        return response.status(500).json({
            error: error.code
        })
    })
}