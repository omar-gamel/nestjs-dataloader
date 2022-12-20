import { Query, Resolver, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { Post } from './posts.model';
import { User } from '../user/user.model';
import { UserLoader, UserLoaderType } from '../user/users.dataloader';
import { PostLoader, PostLoaderType } from './posts.dataloader';
import { Loader } from '../../dataLoader/loader.decorator';

@Resolver(Post)
export class PostsResolver {
  @Query(() => [Post])
  async posts(@Loader(PostLoader) postLoader: PostLoaderType) {
    return postLoader.loadMany([1, 2, 3, 4, 5]);
  }

  @Query(() => Post)
  async post(
    @Loader(PostLoader) postLoader: PostLoaderType,
    @Args('id', { type: () => Int }) id: number
  ) {
    return postLoader.load(id);
  }

  @ResolveField('createdBy', () => User)
  async getCreatedBy(
    @Parent() post: Post,
    @Loader(UserLoader) usersLoader: UserLoaderType
  ): Promise<User> {
    const { userId } = post;
    return await usersLoader.load(userId);
  }
}
