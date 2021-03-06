import {Collection, Db, MongoClient} from 'mongodb';

import {InstallationDocument, IssueDocument} from '../core';

export const COLLECTION_NAME_DICT = {
  issue: 'issues',
  installation: 'installations',
};

export interface DocumentTypeDict {
  issue: IssueDocument;
  installation: InstallationDocument;
}

export interface DBServiceOptions {
  uri: string;
  name: string;
}

export class DBService {
  protected db!: Db;

  readonly ready: Promise<void>;

  constructor(options: DBServiceOptions) {
    this.ready = this.initialize(options);
  }

  collectionOfType<TType extends keyof DocumentTypeDict>(
    type: TType,
  ): Collection<DocumentTypeDict[TType]> {
    let name = COLLECTION_NAME_DICT[type];
    return this.db.collection(name);
  }

  collection<T>(name: string): Collection<T> {
    return this.db.collection(name);
  }

  collections(): Promise<Collection<any>[]> {
    return this.db.collections();
  }

  async dropDatabase(): Promise<void> {
    return this.db.dropDatabase();
  }

  private async initialize({uri, name}: DBServiceOptions): Promise<void> {
    let client = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      ignoreUndefined: true,
    });

    this.db = client.db(name);

    console.info(`Connected to MongoDB ${uri}.`);
  }
}
