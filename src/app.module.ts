import { Module } from '@nestjs/common';
import { join } from 'path';
import { ApolloDriver } from '@nestjs/apollo';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { UsersModule } from './example/user/users.module';
import { PostsModule } from './example/post/posts.module';
import { GraphQLModule } from '@nestjs/graphql';
import { PostsService } from './example/post/posts.service';
import { UsersService } from './example/user/users.service';
import { DataLoaderInterceptor } from './dataLoader/dataloader.interceptor';

@Module({
  imports: [
    UsersModule,
    PostsModule,
    GraphQLModule.forRootAsync({
      imports: [PostsModule, UsersModule],
      useFactory: (postsService: PostsService, usersService: UsersService) => ({
        autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
        context: () => ({})
      }),
      inject: [PostsService, UsersService],
      driver: ApolloDriver
    })
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: DataLoaderInterceptor
    }
  ]
})
export class AppModule {}
