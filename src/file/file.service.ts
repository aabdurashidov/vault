import { Injectable, NotFoundException } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import { FileEntity } from './file.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FileService {
  private readonly uploadPath: string = 'uploads/';

  async uploadFile(file: Express.Multer.File): Promise<FileEntity> {
    const timestamp = Date.now();
    const filename = `${timestamp}_${file.originalname}`;
    const uploadPath = path.resolve(this.uploadPath, filename);

    await fs.promises.writeFile(uploadPath, file.buffer);

    const fileEntity = new FileEntity();
    fileEntity.id = uuidv4();
    fileEntity.filename = filename;
    fileEntity.originalFilename = file.originalname;
    fileEntity.size = file.size;
    fileEntity.mimetype = file.mimetype;
    fileEntity.uploadDate = new Date(timestamp);

    return fileEntity;
  }

  async getFile(fileId: string): Promise<fs.ReadStream> {
    const filePath = path.join('uploads', fileId);

    return new Promise((resolve, reject) => {
      fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
          reject(new NotFoundException('File not found'));
        } else {
          const stream = fs.createReadStream(filePath);
          resolve(stream);
        }
      });
    });
  }
}
