import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { readFileSync } from 'fs';
import { Post } from './posts.model';

@Injectable()
export class PostsService {
  private readonly posts: Post[] = JSON.parse(
    readFileSync(join(process.cwd(), 'src', 'example', 'store', 'posts.json'), 'utf-8')
  );

  findAll(): Post[] {
    console.log(`Getting all posts`);
    return this.posts;
  }

  findOne(id: number): Post {
    console.log(`Getting post with id: ${id}`);
    return this.posts.find(post => post.id === id);
  }

  findByIds(ids: readonly number[]): Post[] {
    return this.posts.filter(post => ids.includes(post.id)); // return only the posts that are included.
  }
}
