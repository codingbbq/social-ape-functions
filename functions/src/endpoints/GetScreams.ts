
export{};
const { db } = require('../helpers/admin');

exports.GetScreams = (request: any, response: any) => {
    db
    .collection('screams')
    .orderBy('createdAt', 'desc')
    .get()
    .then((data: any) => {
        const screams: any[] = [];
        data.forEach((doc: any) => {
            screams.push({
                id: doc.id,
                handle: doc.data().handle,
                body: doc.data().body,
                createdAt: doc.data().createdAt
            })
        });
        return response.json(screams);
    }).catch((error: any) => {
        console.log(error);
    });
}