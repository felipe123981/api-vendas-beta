import path from 'path';
import multer, { FileFilterCallback } from 'multer';
import crypto from 'crypto';
import { Request } from 'express';

const uploadFolder = path.resolve(__dirname, '..', '..', 'uploads');

export default {
  fileFilter: (
    request: Request,
    file: Express.Multer.File,
    callback: FileFilterCallback,
  ): void => {
    if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg' ||
      file.mimetype === 'image/webp'
    ) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  directory: uploadFolder,
  storage: multer.diskStorage({
    destination: uploadFolder,
    filename(request, file, callback) {
      const fileHash = crypto.randomBytes(10).toString('hex');

      const filename = `${fileHash}-${file.originalname}`;

      callback(null, filename);
    },
  }),
};
