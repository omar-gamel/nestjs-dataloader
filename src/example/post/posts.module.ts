import { forwardRef, Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsResolver } from './posts.resolver';
import { UsersModule } from '../user/users.module';
import { PostLoader } from './posts.dataloader';

@Module({
  imports: [forwardRef(() => UsersModule)],
  providers: [PostsService, PostsResolver, PostLoader],
  exports: [PostsService]
})
export class PostsModule {}
