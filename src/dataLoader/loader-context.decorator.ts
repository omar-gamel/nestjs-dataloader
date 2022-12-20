import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { getNestDataLoaderContext, NestDataLoaderContext } from './nest-dataloader';

/**
 * The decorator to be used to get the data loader context
 */
export const LoaderContext = createParamDecorator(
  // tslint:disable-next-line: ban-types
  (data: any, context: ExecutionContext): NestDataLoaderContext => {
    return getNestDataLoaderContext(context);
  }
);
