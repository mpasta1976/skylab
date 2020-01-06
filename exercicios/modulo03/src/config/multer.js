import multer from 'multer';
import crypto from 'crypto';
import { extname, resolve } from 'path';

export default {
  // local, no disco //
  storage: multer.diskStorage({
    destination: resolve('temp', 'uploads'),
    filename: (req, file, cb) => {
      crypto.randomBytes(16, (err, res) => {
        if (err) return cb(error);

        return cb(null, res.toString('hex') + extname(file.originalname));
      });
    },
  }),

  //storage: multer.cdn // S3
};
