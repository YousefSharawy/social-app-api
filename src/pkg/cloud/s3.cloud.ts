import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { ICloudProvider } from "./cloud.interface";
import { promise } from "zod";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { toSec } from "../utils/convert_time_units";
interface IS3Config {
    region : string, 
    accessKey : string, 
    secretAccessKey : string, 
    bucketName : string, 

} 
export class S3CloudProvider implements ICloudProvider {

    private s3Client : S3Client; 
    private readonly bucketName : string ;

    constructor (config : IS3Config){
        this.s3Client = new S3Client({  
            region : config.region,
            credentials :{
                accessKeyId: config.accessKey,
                secretAccessKey : config.secretAccessKey,
            }
        });
        this.bucketName = config.bucketName ;
    }
    public async uploadFile(file:Express.Multer.File, path: string): Promise<string> {
        const command = new PutObjectCommand({
            ContentType : file.mimetype,
            Bucket:this.bucketName,
            Body:file.buffer,
            Key:`${path}/${new Date().toISOString()}-${file.originalname}`,
        });
        await this.s3Client.send(command);
        return command.input.Key as string;
    }
    
    public async deleteFile(key: string): Promise<void> {
        const command = new DeleteObjectCommand({
            Bucket:this.bucketName,
            Key : key
        });
        await this.s3Client.send(command);
    }
    public async getFile(key: string): Promise<Buffer> {
        return Promise.resolve(new Buffer('00'));
    }
    
    generatePresignedUrl = async ( file: Express.Multer.File, path: string): Promise<string> => {
        const command  = new PutObjectCommand({
            Bucket : this.bucketName, 
            ContentType : file.mimetype,
             Key:`${path}/${new Date().toISOString()}-${file.originalname}`,
        });
       return await getSignedUrl(this.s3Client ,command, {expiresIn : toSec('minutes',1)});
    }
    
}