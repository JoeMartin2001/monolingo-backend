import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PresignedUrl {
  @Field() url!: string;
  @Field() key!: string;
}
