import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as sharp from "sharp";
import { LoggerService } from "src/global/logger.service";

@Injectable()
export class UploadImageService {
    private readonly s3Client = new S3Client({
        region: this.configService.getOrThrow('AWS_S3_REGION'),
        credentials: {
            accessKeyId: this.configService.getOrThrow('AWS_ACCESS_KEY_ID'),
            secretAccessKey: this.configService.getOrThrow('AWS_SECRET_ACCESS_KEY')
        }
    });

    constructor(private readonly configService: ConfigService, private logger: LoggerService){}

    async upload(fileName: string, file: Buffer, contentType: string){
        try {
            const originalBuffer = file;
            const resizedBuffer = await sharp(originalBuffer)
                .resize(50, 50)
                .toBuffer();
                console.log(contentType);
            await this.s3Client.send(
                new PutObjectCommand({
                    Bucket: this.configService.get('AWS_BUCKET_NAME'),
                    Key: `original/${fileName}.png`,
                    Body: file,
                    ContentType: contentType,
                    ACL: 'public-read'
                })
            )
            await this.s3Client.send(
                new PutObjectCommand({
                    Bucket: this.configService.get('AWS_BUCKET_NAME'),
                    Key: `avatar/${fileName}.png`,
                    Body: resizedBuffer,
                    ContentType: contentType,
                    ACL: 'public-read'
                })
            )
            return {
                avatarHqUrl: `https://${this.configService.get('AWS_BUCKET_NAME')}.s3.${this.configService.get('AWS_S3_REGION')}.amazonaws.com/original/${fileName}.png`,
                avatarLqUrl: `https://${this.configService.get('AWS_BUCKET_NAME')}.s3.${this.configService.get('AWS_S3_REGION')}.amazonaws.com/avatar/${fileName}.png`,
              };
        }catch(error){
            this.logger.error(`Error uploading file ${fileName}`, error.stack);
            throw new InternalServerErrorException('An error occurred while uploading the file');
        }
    }
}