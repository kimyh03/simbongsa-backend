import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CommonOutput } from 'src/common/dto/CommonOutput';
import { applicationStatus } from './ApplicationStatus.enum';

@InputType()
export class HandleApplicationInput {
  @Field()
  applicationId: number;

  @Field()
  status: applicationStatus;
}

@ObjectType()
export class HandleApplicationOutput extends CommonOutput {}
