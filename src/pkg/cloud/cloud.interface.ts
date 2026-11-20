export interface ICloudProvider {
uploadFile(file:any, path:string) : Promise<String>;

deleteFile(key:string):Promise<void>;

getFile(key:string): Promise<Buffer>;
}