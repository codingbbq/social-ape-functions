export{};

const { db } = require('../helpers/admin');

exports.GetScream = (request: any, response: any) => {
    let screamData: any = {};

    db.doc(`/screams/${request.params.screamId}`)
    .get()
    .then((doc: any) => {
        if(!doc.exists) {
            return response.status(404).json({
                error: 'Scream not found'
            });
        }

        screamData = doc.data();
        screamData.screamId = doc.id;
        return db.collection('comments')
        .orderBy('createdAd', 'desc')
        .where('screamId', '==', request.params.screamId)
        .get()
    })
    .then((data: any) => {
        screamData.comments = [];
        data.forEach((item: any) => {
            screamData.comments.push(item.data());
        });
        return response.json(screamData);
    })
    .catch((error: any) => {
        return response.status(500).json({
            error: error.code
        });
    })
}