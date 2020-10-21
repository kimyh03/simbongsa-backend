import { Field, ObjectType } from '@nestjs/graphql';
import { CommonOutput } from 'src/common/dto/CommonOutput';
import { Certificate } from '../certificate.entity';

@ObjectType()
export class GetMyCertificatesOutput extends CommonOutput {
  @Field(() => [Certificate], { nullable: true })
  certificates?: Certificate[];
}
