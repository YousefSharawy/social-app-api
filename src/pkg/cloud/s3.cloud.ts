import { S3Client } from "@aws-sdk/client-s3";
import { ICloudProvider } from "./cloud.interface";
interface IS3Config {
    region : string, 
    accessKey : string, 
    secretAccessKey : string, 
} 
export class S3CloudProvider implements ICloudProvider {

    private s3Client : S3Client; 

    constructor (config : IS3Config){
        this.s3Client = new S3Client({  
            region : config.region,
            credentials :{
                accessKeyId: config.accessKey,
                secretAccessKey : config.secretAccessKey,
            }
        });
    }
    uploadFile(file: any, path: string): Promise<String> {
        throw new Error("Method not implemented.");
    }
    deleteFile(key: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    getFile(key: string): Promise<Buffer> {
        throw new Error("Method not implemented.");
    }

}