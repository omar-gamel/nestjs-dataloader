import { Injectable } from '@nestjs/common';
import { User } from './user.model';
import { readFileSync } from 'fs';
import { join } from 'path';

@Injectable()
export class UsersService {
  private readonly users: User[] = JSON.parse(
    readFileSync(join(process.cwd(), 'src', 'example', 'store', 'users.json'), 'utf-8')
  );

  getUser(id: number): User {
    console.log(`Getting user with id ${id}...`);
    return this.users.find(user => user.id === id);
  }

  findByIds(ids: readonly number[]): User[] {
    return this.users.filter(user => ids.includes(user.id));
  }
}
