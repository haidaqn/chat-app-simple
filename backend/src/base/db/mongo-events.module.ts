import { Global, Injectable, Module } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import * as mongoose from 'mongoose';

abstract class MongoEvent<TDocument extends mongoose.Document> {
  event: string;
  doc: TDocument;

  protected constructor(event: string, doc: TDocument) {
    this.event = event;
    this.doc = doc;
  }
}

export class MongoPreSaveEvent<
  TDocument extends mongoose.Document,
> extends MongoEvent<TDocument> {
  constructor(modelName: string, doc: TDocument) {
    super(modelName + '.post.save', doc);
  }
}

export class MongoPostSaveEvent<
  TDocument extends mongoose.Document,
> extends MongoEvent<TDocument> {
  constructor(modelName: string, doc: TDocument) {
    super(modelName + '.post.save', doc);
  }
}

export class MongoPostRemoveEvent<
  TDocument extends mongoose.Document,
> extends MongoEvent<TDocument> {
  constructor(modelName: string, doc: TDocument) {
    super(modelName + '.post.deleteOne', doc);
  }
}

@Injectable()
export class MongoEvents {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  public forSchema<TDocument extends mongoose.Document>(
    modelName: string,
    schema: mongoose.Schema<TDocument>,
  ) {
    const eventEmitter = this.eventEmitter;
    schema.pre('save', async function (doc) {
      const event = new MongoPreSaveEvent(modelName, this);
      eventEmitter.emit(event.event, event);
    });
    schema.post('save', async function (doc) {
      const event = new MongoPostSaveEvent(modelName, doc);
      eventEmitter.emit(event.event, event);
    });
    schema.post('deleteOne', async (doc) => {
      const event = new MongoPostRemoveEvent(modelName, doc);
      eventEmitter.emit(event.event, event);
    });
    return schema;
  }
}

@Global()
@Module({
  providers: [MongoEvents],
  exports: [MongoEvents],
})
export class MongoEventsModule {}
