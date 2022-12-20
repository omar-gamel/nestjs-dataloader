import { Injectable } from '@nestjs/common';
import * as DataLoader from 'dataloader';
import { NestDataLoader } from '../../dataLoader/nest-dataloader';
import { deriveMapFromArray } from '../util/mapFromArray';
import { PostsService } from './posts.service';
import { Post } from './posts.model';

export type PostLoaderType = DataLoader<number, Post>;

@Injectable()
export class PostLoader implements NestDataLoader<number, Post> {
  constructor(private readonly postsService: PostsService) {}

  public generateDataLoader() {
    const postLoader: PostLoaderType = new DataLoader<number, Post>(async ids => {
      const posts = await this.postsService.findByIds(ids);
      const postsMap = deriveMapFromArray(posts, (post: Post) => post.id);
      return ids.map(id => postsMap.get(id));
    });
    return postLoader;
  }
}
