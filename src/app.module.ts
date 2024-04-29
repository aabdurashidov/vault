import { Module } from '@nestjs/common';
import { FileController } from './file/file.controller';
import { FileService } from './file/file.service';

@Module({
  imports: [],
  controllers: [FileController],
  providers: [FileService],
})
export class AppModule {}
