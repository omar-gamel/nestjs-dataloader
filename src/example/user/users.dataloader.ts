import { Injectable } from '@nestjs/common';
import * as DataLoader from 'dataloader';
import { NestDataLoader } from '../../dataLoader/nest-dataloader';
import { User } from './user.model';
import { UsersService } from './users.service';
import { deriveMapFromArray } from '../util/mapFromArray';

export type UserLoaderType = DataLoader<number, User>;

@Injectable()
export class UserLoader implements NestDataLoader<number, User> {
  constructor(private readonly userService: UsersService) {}

  public generateDataLoader() {
    const userLoader: UserLoaderType = new DataLoader<number, User>(async ids => {
      const users = await this.userService.findByIds(ids);
      const postsMap = deriveMapFromArray(users, (user: User) => user.id);
      return ids.map(id => postsMap.get(id));
    });
    return userLoader;
  }
}
