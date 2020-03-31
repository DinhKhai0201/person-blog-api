const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

class CloudinaryService {
    upload(path, public_id){
        return new Promise(resolve => {
            cloudinary.uploader.upload(path, {public_id: public_id},function(err, image){
                if(err) resolve({success: false});
                else{
                    resolve({
                        success: true,
                        public_id: image.public_id,
                        format: image.format,
                    })
                }
            })
        })
    }

    delete(public_id){
        return new Promise(resolve => {
            cloudinary.uploader.destroy(public_id, function(err, result){
                if(err) {
                    console.log(err);
                    resolve({ success: false});
                }
                resolve({success: true});
            })
        })
    }
}

module.exports = new CloudinaryService();