import { Field, ObjectType } from '@nestjs/graphql';
import { CommonOutput } from 'src/common/dto/CommonOutput';
import { Application } from '../application.entity';

@ObjectType()
export class GetMyApplicationsOutput extends CommonOutput {
  @Field(() => [Application], { nullable: true })
  applications?: Application[];
}
