export{};
const { admin, db } = require('../helpers/admin');

exports.FBAuth = (request: any, response: any, next: any) => {
    let idToken;
    if(request.headers.authorization && request.headers.authorization.startsWith('Bearer ')) {
        idToken = request.headers.authorization.split('Bearer ')[1];
    } else {
        console.error("No token found");
        return response.status(401).json({
            error: 'Unauthorized'
        });
    }

    admin.auth().verifyIdToken(idToken)
        .then((decodedToken: string) => {
            request.user = decodedToken;
            console.log(decodedToken);
            return db
            .collection('users')
            .where('userId', '==', request.user.uid)
            .limit(1)
            .get();
        })
        .then((data: any) => {
            request.user.handle = data.docs[0].data().handle;
            request.user.imageUrl = data.docs[0].data().imageUrl;
            return next();
        })
        .catch((error: any) => {
            console.error("Error verifying the token", error);
            return response.status(403).json(error);
        });
}