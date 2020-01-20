const AWS = require('aws-sdk');
const fs = require('fs')
const BUCKET_NAME = 'doancnpm';
const IAM_USER_KEY = 'AKIAJBXPZ2OWWQ5GXWEA';
const IAM_USER_SECRET = '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';
class AwsService {
    uploadToS3(filePath, type, filename) {
        return new Promise((resolve, reject) => {
            let s3bucket = new AWS.S3({
                accessKeyId: IAM_USER_KEY,
                secretAccessKey: IAM_USER_SECRET,
                Bucket: BUCKET_NAME,
            });
            let fileExtentioin = filename.split('.').pop()
            let key = "public/image/" + type + "/" + filename;
            fs.readFile(filePath, (err, data) => {
                let base64 = new Buffer(data, "binary")
                let params = {
                    Bucket: BUCKET_NAME,
                    Key: key,
                    Body: base64,
                    ContentType: 'image/' + fileExtentioin,
                };
                s3bucket.upload(params, function (err, data) {
                    if (err) {
                        console.log(err);
                        resolve({
                            success: false
                        })
                    }
                    resolve({
                        success: true
                    })
                });
            })

        });
    }
}
module.exports = new AwsService()
