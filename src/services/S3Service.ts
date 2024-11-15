import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';

export class S3Service {
  private static instance: S3Service;
  private s3Client: S3Client;

  private constructor() {
    if (
      !process.env.AWS_REGION ||
      !process.env.AWS_ACCESS_KEY_ID ||
      !process.env.AWS_SECRET_ACCESS_KEY ||
      !process.env.AWS_BUCKET_NAME
    ) {
      throw new Error('Отсутствуют необходимые переменные окружения AWS');
    }

    this.s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  public static getInstance(): S3Service {
    if (!S3Service.instance) {
      S3Service.instance = new S3Service();
    }
    return S3Service.instance;
  }

  async checkConnection(): Promise<boolean> {
    console.log('Проверка подключения к S3...');
    try {
      const command = new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: 'test-connection',
      });

      await this.s3Client.send(command);
      console.log('Подключение к S3 успешно установлено');
      return true;
    } catch (error) {
      console.error('Ошибка подключения к S3:', {
        message: error.message,
        code: error.code,
        requestId: error.$metadata?.requestId,
      });
      return false;
    }
  }

  async uploadFile(file: Express.Multer.File, path: string): Promise<{ fileUrl: string; fileKey: string }> {
    if (!file || !file.buffer) {
      throw new Error('Файл отсутствует или поврежден');
    }

    try {
      console.log('Начало загрузки файла:', file.originalname);
      const key = `${path}/${Date.now()}-${file.originalname}`;

      console.log('Параметры загрузки:', {
        bucket: process.env.AWS_BUCKET_NAME,
        key: key,
        contentType: file.mimetype,
        fileSize: file.size,
      });

      const upload = new Upload({
        client: this.s3Client,
        params: {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
        },
        queueSize: 1,
        partSize: 1024 * 1024 * 5,
      });

      upload.on('httpUploadProgress', (progress) => {
        console.log('Прогресс загрузки:', {
          loaded: progress.loaded,
          total: progress.total,
          percentage: progress.total ? Math.round((progress.loaded / progress.total) * 100) : 0,
        });
      });

      console.log('Начинаем процесс загрузки...');
      const result = await upload.done();
      console.log('Результат загрузки:', result);

      console.log('Файл успешно загружен');

      const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
      console.log('URL загруженного файла:', fileUrl);

      return {
        fileUrl,
        fileKey: key,
      };
    } catch (error) {
      console.error('Детальная информация об ошибке:', {
        message: error.message,
        code: error.code,
        requestId: error.$metadata?.requestId,
        stack: error.stack,
      });
      throw new Error(`Ошибка при загрузке файла: ${error.message}`);
    }
  }

  async deleteFile(fileKey: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileKey,
    });

    await this.s3Client.send(command);
  }
}
