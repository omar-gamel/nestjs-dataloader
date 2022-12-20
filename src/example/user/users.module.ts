import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserLoader } from './users.dataloader';

@Module({
  imports: [],
  providers: [UsersService, UserLoader],
  exports: [UsersService]
})
export class UsersModule {}
