import { UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/auth/currentUser.decorator';
import { LogInOnly } from 'src/auth/logInOnly.guard';
import { User } from 'src/user/user.entity';
import { Certificate } from './certificate.entity';
import { CertificateService } from './certificate.service';
import { GetMyCertificatesOutput } from './dto/GetMyCertificates.dto';

@Resolver()
export class CertificateResolver {
  constructor(private readonly certificateService: CertificateService) {}

  @Query(() => [Certificate])
  async getAllCertificate() {
    return await this.certificateService.findAll();
  }

  @UseGuards(LogInOnly)
  @Query(() => GetMyCertificatesOutput)
  async getMyCertificates(
    @CurrentUser() currentUser: User,
  ): Promise<GetMyCertificatesOutput> {
    try {
      const {
        certificates,
        error,
      } = await this.certificateService.findAllByUserId(currentUser.id);
      if (error) throw new Error(error);
      return {
        ok: true,
        error: null,
        certificates,
      };
    } catch (error) {
      return {
        ok: false,
        error,
        certificates: null,
      };
    }
  }
}
