import { Field, Int, ObjectType } from '@nestjs/graphql';
import { User } from '../user/user.model';

@ObjectType()
export class Post {
  @Field(() => Int)
  id: number;

  @Field()
  title: string;

  @Field()
  content: string;

  @Field(() => Boolean)
  isDone: boolean;

  @Field()
  userId: number;

  @Field(() => User)
  createdBy: User;
}
