'use strict';

const cloudinary = require('../configs/cloudinary.config');

class UploadService {
  static uploadFromUrl = async () => {
    try {
      const urlImg =
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwWiJoPL80naeuqfhE6fLZH2PGVAThJ9HJyQ&s';
      const folderName = 'product/shopId',
        newFileName = 'testdemo';

      const result = await cloudinary.uploader.upload(urlImg, {
        public_id: newFileName,
        folder: folderName,
      });

      return result;
    } catch (error) {
      console.log('Lỗi tải ảnh lên cloudinary:::', error);
    }
  };

  static uploadFileFromLocal = async ({
    path,
    folderName = 'product/8409',
  }) => {
    try {
      const result = await cloudinary.uploader.upload(path, {
        public_id: 'thumb',
        folder: folderName,
      });
      console.log('result:::', result);
      return {
        image_url: result.secure_url,
      };
    } catch (error) {
      console.log('Lỗi tải ảnh lên:::', error);
    }
  };
}
module.exports = UploadService;
