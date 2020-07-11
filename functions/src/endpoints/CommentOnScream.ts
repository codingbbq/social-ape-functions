export{};

const { db } = require('../helpers/admin');

exports.CommentOnScream = (request: any, response: any) => {
    console.log(request.body.body);
    if(request.body.body.trim() === '') {
        return response.status(400).json({
            error: 'Must not be empty'
        });
    }

    const newComment: any = {
        body: request.body.body,
        createdAd: new Date().toISOString(),
        screamId: request.params.screamId,
        handle: request.user.handle,
        userImage: request.user.imageUrl
    }

    console.log(newComment);

    db.doc(`/screams/${request.params.screamId}`)
    .get()
    .then((doc: any) => {
        if(!doc.exists) {
            return response.status(404).json({
                error: 'Scream does not exists'
            })
        }

        return db.collection('comments').add(newComment);
    })
    .then(() => {
        response.json(newComment);
    })
    .catch((error: any) => {
        return response.status(500).json({
            error: error.code
        })
    })
}