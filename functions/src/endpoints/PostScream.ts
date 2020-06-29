export{};
const { admin, db } = require('../helpers/admin');

exports.PostScream = (request: any, response: any) => {

    const newScream : { body: string, handle: string, createdAt: any } = {
        body: request.body.body,
        handle: request.user.handle,
        createdAt: admin.firestore.Timestamp.fromDate(new Date())
    }

    db
    .collection('screams')
    .add(newScream)
    .then((doc: any) => {
        response.json({ 
            message : `Document ${doc.id} created Successfully`
        });
    }).catch((error: any) => {
        response.status(500).json({
            error: 'Something went wrong'
        });
        console.error(error);
    });
}