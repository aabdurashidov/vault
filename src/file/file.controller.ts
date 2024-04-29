import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';
import { FileEntity } from './file.entity';

@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<FileEntity> {
    return await this.fileService.uploadFile(file);
  }

  @Get(':fileId')
  async getFile(@Param('fileId') fileId: string, @Res() res: Response) {
    try {
      const stream = await this.fileService.getFile(fileId);
      stream.pipe(res);
    } catch (error) {
      console.error('File does not exist');
      res.status(404).send('File not found');
    }
  }

  @Get()
  async getFiles(): Promise<FileEntity[]> {
    return await this.fileService.getFiles();
  }

  @Delete(':fileId')
  async deleteFile(@Param('fileId') fileId: string): Promise<void> {
    await this.fileService.deleteFile(fileId);
  }
}
