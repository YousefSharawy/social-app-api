import multer, { diskStorage } from "multer";
import { Request } from "express";
import crypto from "crypto";
import { AppError } from "../error/error.js";

// cb(error: Error)                     // reject with an error
// cb(error: null, acceptFile: boolean) // no error, accept or skip

function multerUpload(allowedTypes = ["image/png", "image/jpeg"]) {
  return multer({
    fileFilter: function (req: Request, file, cb) {
      if (!allowedTypes.includes(file.mimetype)) {
        return cb(new AppError("invalide file format", 400));
      }
      cb(null, true);
    },
    storage: diskStorage({
      destination: "uploads",
      filename: function (req, file, cb) {
        cb(null, `${crypto.randomUUID()}-${file.originalname}`);
      },
    }),
  });
}
export function uploadSingleFile(
  fieldName: string,
  allowedTypes = ["image/png", "image/jpeg"],
) {
  return multerUpload().single(fieldName);
}
export function uploadFilesArray(fieldName: string, maxCount: number) {
  return multerUpload().array(fieldName, maxCount);
}
export function uploadFields(fieldName: multer.Field[]) {
  return multerUpload().fields(fieldName);
}
