import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CommonOutput } from 'src/common/dto/CommonOutput';

@InputType()
export class CancelApplicationInput {
  @Field()
  applicationId: number;
}

@ObjectType()
export class CalcelApplicationOutput extends CommonOutput {}
