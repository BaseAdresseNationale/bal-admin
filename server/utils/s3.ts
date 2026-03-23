import {
  PutObjectCommand,
  PutObjectCommandInput,
  PutObjectCommandOutput,
  S3Client,
} from '@aws-sdk/client-s3';

class S3Service {
  private static s3Client = new S3Client({
    region: process.env.S3_REGION,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_KEY,
    },
    endpoint: process.env.S3_ENDPOINT,
  });

  static async uploadPublicFile(
    fileId: string,
    bucket: string,
    data: Buffer,
    options: Partial<PutObjectCommandInput> = {},
  ): Promise<PutObjectCommandOutput> {
    return S3Service.s3Client.send(
      new PutObjectCommand({
        ACL: 'public-read',
        Bucket: bucket,
        Key: fileId,
        Body: data,
        ...options,
      }),
    );
  }
}

export { S3Service };