import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class FileEntity extends Document {
  @Prop({ required: true })
  filename: string;

  @Prop({ required: true })
  originalFilename: string;

  @Prop({ required: true })
  size: number;

  @Prop({ required: true })
  mimetype: string;

  @Prop({ required: true })
  uploadDate: Date;
}

export const FileEntitySchema = SchemaFactory.createForClass(FileEntity);
