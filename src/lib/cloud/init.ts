import { S3CloudProvider } from "../../pkg/cloud/s3.cloud";
import { env } from "../config/env";

export const cloudProvider= new S3CloudProvider ({
    region : env.aws.region ,
    accessKey: env.aws.accessKey ,
    secretAccessKey : env.aws.secretKey,
});