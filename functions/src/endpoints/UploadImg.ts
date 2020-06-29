export{};
const { db, admin } = require('../helpers/admin');
const firebaseConfig = require('../../keys/firebaseConfig.json');

exports.UploadImg = (request: any, response: any) => {
    const BusBoy = require('busboy');
    const path = require('path');
    const os = require('os');
    const fs = require('fs');

    const busboy = new BusBoy({
        headers : request.headers
    });

    let imageFileName: string, imageToBeUploaded: any;
    busboy.on('file', (fieldname: string, file: any, filename: string, encoding: string, mimetype: String) => {
        console.log(fieldname);
        console.log(file);
        console.log(filename);
        console.log(encoding);
        console.log(mimetype);

        const imageExtension = filename.split('.')[filename.split('.').length - 1];
        imageFileName = `${Math.round(Math.random()*100000000000)}.${imageExtension}`;
        const filepath = path.join(os.tmpdir(), imageFileName);
        imageToBeUploaded = { filepath, mimetype};
        file.pipe(fs.createWriteStream(filepath));

    });

    busboy.on('finish', () => {
        admin.storage().bucket().upload(imageToBeUploaded.filepath, {
            resumable: false,
            metadata: {
                contentType: imageToBeUploaded.mimetype
            }
        })
        .then(() => {
            const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/${imageFileName}?alt=media`;
            return db.doc(`/users/${request.user.handle}`).update({
                imageUrl : imageUrl
            })
        })
        .then(() => {
            return response.json({ message: 'Image uploaded successfully!'})
        })
        .catch((error: any) => {
            console.error(error);
            response.status(500).json({
                error: error.code
            })
        })
    });
    busboy.end(request.rawBody);
}