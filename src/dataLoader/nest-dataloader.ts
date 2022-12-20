import { ExecutionContext, InternalServerErrorException, Type } from '@nestjs/common';
import { APP_INTERCEPTOR, ContextId, ContextIdFactory } from '@nestjs/core';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import DataLoader from 'dataloader';
import { DataLoaderInterceptor } from './dataloader.interceptor';

/**
 * This interface will be used to generate the initial data loader.
 * The concrete implementation should be added as a provider to your module.
 */
// tslint:disable-next-line: interface-name
export interface NestDataLoader<ID, Type> {
  /**
   * Should return a new instance of dataloader each time
   */
  generateDataLoader(): DataLoader<ID, Type>;
}

/**
 * Context key where get loader function will be stored.
 * This class should be added to your module providers like so:
 * {
 *     provide: APP_INTERCEPTOR,
 *     useClass: DataLoaderInterceptor,
 * },
 */
export const NEST_LOADER_CONTEXT_KEY: string = 'NEST_LOADER_CONTEXT_KEY';

export function getNestDataLoaderContext(context: ExecutionContext): NestDataLoaderContext {
  if (context.getType<GqlContextType>() !== 'graphql') {
    throw new InternalServerErrorException(
      '@Loader should only be used within the GraphQL context'
    );
  }
  const graphqlContext = GqlExecutionContext.create(context).getContext();
  const nestDataLoaderContext = graphqlContext[NEST_LOADER_CONTEXT_KEY];
  if (!nestDataLoaderContext) {
    throw new InternalServerErrorException(
      `You should provide interceptor ${DataLoaderInterceptor.name} globally with ${APP_INTERCEPTOR}`
    );
  }
  return nestDataLoaderContext;
}

export interface DataLoaderFactory {
  (contextId: ContextId, type: Type<NestDataLoader<any, any>>): Promise<DataLoader<any, any>>;
}

export class NestDataLoaderContext {
  private readonly id: ContextId = ContextIdFactory.create();
  private readonly cache: Map<Type<NestDataLoader<any, any>>, Promise<DataLoader<any, any>>> =
    new Map<Type<NestDataLoader<any, any>>, Promise<DataLoader<any, any>>>();

  constructor(private readonly dataloaderFactory: DataLoaderFactory) {}

  async clearAll() {
    for (const loaderPromise of this.cache.values()) {
      const loader = await loaderPromise;
      loader.clearAll();
    }
  }

  getLoader(type: Type<NestDataLoader<any, any>>): Promise<DataLoader<any, any>> {
    let loader = this.cache.get(type);
    if (!loader) {
      loader = this.dataloaderFactory(this.id, type);
      this.cache.set(type, loader);
    }
    return loader;
  }
}
