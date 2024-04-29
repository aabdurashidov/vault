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
      uploadDate: timestamp,
    });

    return fileEntity.save();
  }

  async downloadFile(fileId: string): Promise<fs.ReadStream> {
    const fileEntity = await this.fileModel.findOne({ _id: fileId });

    if (!fileEntity) {
      throw new NotFoundException('File not found');
    }

    const filePath = path.resolve(this.uploadPath, fileEntity.filename);

    try {
      await fs.promises.access(filePath, fs.constants.F_OK);
      return fs.createReadStream(filePath);
    } catch (err) {
      throw new NotFoundException('File not found');
    }
  }

  async getFile(fileId: string) {
    const fileEntity = await this.fileModel.findOne({ _id: fileId });

    if (!fileEntity) {
      throw new NotFoundException('File not found');
    }

    return fileEntity;
  }

  async getFiles(): Promise<FileEntity[]> {
    return this.fileModel.find();
  }

  async deleteFile(fileId: string): Promise<any> {
    const fileEntity = await this.fileModel.findByIdAndDelete(fileId);

    if (!fileEntity) {
      throw new NotFoundException('File not found');
    }

    const filePath = path.resolve(this.uploadPath, fileEntity.filename);

    try {
      await fs.promises.rm(filePath);
    } catch (err) {
      console.error(`Error deleting file ${filePath}:`, err);
    }
  }
}
