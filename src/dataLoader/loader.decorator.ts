import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
  Type
} from '@nestjs/common';
import DataLoader from 'dataloader';
import { getNestDataLoaderContext, NestDataLoader } from './nest-dataloader';

/**
 * The decorator to be used within your graphql method.
 */
export const Loader = createParamDecorator(
  // tslint:disable-next-line: ban-types
  (
    data: Type<NestDataLoader<any, any>>,
    context: ExecutionContext
  ): Promise<DataLoader<any, any>> => {
    if (!data) {
      throw new InternalServerErrorException(`No loader provided to @Loader ('${data}')`);
    }
    return getNestDataLoaderContext(context).getLoader(data);
  }
);

// https://github.com/graphql/dataloader/issues/66#issuecomment-386252044
export const ensureOrder = options => {
  const { docs, keys, prop, error = key => `Document does not exist (${key})` } = options;
  // Put documents (docs) into a map where key is a document's ID or some
  // property (prop) of a document and value is a document.
  const docsMap = new Map();
  docs.forEach(doc => docsMap.set(doc[prop], doc));
  // Loop through the keys and for each one retrieve proper document. For not
  // existing documents generate an error.
  return keys.map(key => {
    return docsMap.get(key) || new Error(typeof error === 'function' ? error(key) : error);
  });
};

export interface IOrderedNestDataLoaderOptions<ID, Type> {
  propertyKey?: string;
  query: (keys: readonly ID[]) => Promise<Type[]>;
  typeName?: string;
  dataloaderConfig?: DataLoader.Options<ID, Type>;
}

// tslint:disable-next-line: max-classes-per-file
export abstract class OrderedNestDataLoader<ID, Type> implements NestDataLoader<ID, Type> {
  protected abstract getOptions: () => IOrderedNestDataLoaderOptions<ID, Type>;

  public generateDataLoader() {
    return this.createLoader(this.getOptions());
  }

  protected createLoader(options: IOrderedNestDataLoaderOptions<ID, Type>): DataLoader<ID, Type> {
    const defaultTypeName = this.constructor.name.replace('Loader', '');
    return new DataLoader<ID, Type>(async keys => {
      return ensureOrder({
        docs: await options.query(keys),
        keys,
        prop: options.propertyKey || 'id',
        error: keyValue => `${options.typeName || defaultTypeName} does not exist (${keyValue})`
      });
    }, options.dataloaderConfig);
  }
}
