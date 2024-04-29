import { Injectable, NotFoundException } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import { FileEntity } from './file.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class FileService {
  private readonly uploadPath: string = 'uploads/';

  constructor(
    @InjectModel(FileEntity.name) private fileModel: Model<FileEntity>,
  ) {}

  async uploadFile(file: Express.Multer.File): Promise<FileEntity> {
    const timestamp = Date.now();
    const filename = `${timestamp}_${file.originalname}`;
    const uploadPath = path.resolve(this.uploadPath, filename);

    await fs.promises.writeFile(uploadPath, file.buffer);

    const fileEntity = new this.fileModel({
      filename: filename,
      originalFilename: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
      uploadDate: new Date(Date.now()),
    });

    return fileEntity.save();
  }

  async getFile(fileId: string): Promise<fs.ReadStream> {
    const fileEntity = await this.fileModel.findOne({ _id: fileId });
    const filePath = path.join('uploads', fileEntity.filename);

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
