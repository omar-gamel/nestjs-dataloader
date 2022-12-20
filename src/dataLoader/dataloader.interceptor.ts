import {
  CallHandler,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  NestInterceptor,
  Type
} from '@nestjs/common';
import { ContextId, ModuleRef } from '@nestjs/core';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import DataLoader from 'dataloader';
import { Observable } from 'rxjs';
import { NestDataLoader, NestDataLoaderContext, NEST_LOADER_CONTEXT_KEY } from './nest-dataloader';

@Injectable()
export class DataLoaderInterceptor implements NestInterceptor {
  constructor(private readonly moduleRef: ModuleRef) {}

  public intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if (context.getType<GqlContextType>() !== 'graphql') {
      return next.handle();
    }
    const ctx = GqlExecutionContext.create(context).getContext();
    if (ctx[NEST_LOADER_CONTEXT_KEY] === undefined) {
      ctx[NEST_LOADER_CONTEXT_KEY] = new NestDataLoaderContext(this.createDataLoader.bind(this));
    }
    return next.handle();
  }

  private async createDataLoader(
    contextId: ContextId,
    type: Type<NestDataLoader<any, any>>
  ): Promise<DataLoader<any, any>> {
    try {
      const provider = await this.moduleRef.resolve<NestDataLoader<any, any>>(type, contextId, {
        strict: false
      });
      return provider.generateDataLoader();
    } catch (e) {
      throw new InternalServerErrorException(`The loader ${type} is not provided` + e);
    }
  }
}
