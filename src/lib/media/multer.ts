import multer, { diskStorage } from "multer";

export function multerUpload() {
  return multer({
    storage: diskStorage({}),
  });
}
export function uploadSingle(fieldName : string) {
    return multerUpload().single(fieldName);
}
export function uploadArray(fieldName : string,maxCount:number) {
    return multerUpload().array(fieldName,maxCount);
}
