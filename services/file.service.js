const fs = require('fs');
const path = require('path');
const awsService = require('../services/aws.service')
class FileService {
    uploadFile(req) {
        return new Promise((resolve) => {
            var type = req.query.type;
            let fstream;
            let saveTo = '';
            let fileNameSave = '';
            let localPath;
            if (req.busboy) {
                req.busboy.on('file', function (fieldname, file, filename) {
                    fileNameSave = filename;
                    var directoryPath = path.join(__dirname, '../public') + '/img/upload/' + type;
                    if (!fs.existsSync(directoryPath)) {
                        fs.mkdirSync(directoryPath);
                    }
                    localPath = '/img/upload/' + type + '/' + filename;
                    saveTo = path.join(__dirname, '../public') + localPath;
                    fstream = fs.createWriteStream(saveTo);
                    file.pipe(fstream);
                });
                req.busboy.on('finish', function () {
                    awsService.uploadToS3(saveTo, type, fileNameSave)
                    resolve({
                        success: true,
                        data: fileNameSave
                    });
                });
                req.pipe(req.busboy);
            }
        })
    }
}

module.exports = new FileService()