import { Module } from '@nestjs/common';
import { FileController } from './file/file.controller';
import { FileService } from './file/file.service';
import { FileEntity, FileEntitySchema } from './file/file.entity';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb://rootUser:rootUserPassword@localhost:27017',
    ),
    MongooseModule.forFeature([
      { name: FileEntity.name, schema: FileEntitySchema },
    ]),
  ],
  controllers: [FileController],
  providers: [FileService],
})
export class AppModule {}
