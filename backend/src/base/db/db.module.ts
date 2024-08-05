import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { getModelToken, MongooseModule, SchemaFactory } from '@nestjs/mongoose';
import * as models from './models';
import { DbService } from './services';
import paginate from 'mongoose-paginate-v2';
import { MongoEvents } from './mongo-events.module';

@Module({
  imports: [
    TerminusModule,
    HttpModule,
    MongooseModule.forFeatureAsync(
      Object.values(models).map((item) => ({
        name: item.name,
        useFactory: (events: MongoEvents) => {
          const schema = SchemaFactory.createForClass(item as any);
          schema.loadClass(item);
          schema.plugin(paginate);
          events.forSchema(item.name, schema);
          return schema;
        },
        inject: [MongoEvents],
      })),
    ),
  ],
  providers: [DbService],
  exports: [DbService],
})
export class DbModule {}
