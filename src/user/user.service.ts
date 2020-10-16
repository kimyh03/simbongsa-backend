import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { Repository } from 'typeorm';
import { SignInInput } from './dto/SignIn.dto';
import { SignUpInput } from './dto/SignUp.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  async getToken(userId: number) {
    return this.authService.sign(userId);
  }

  async decodeToken(token: string) {
    return this.authService.verify(token);
  }

  async findOneById(userId: string) {
    return this.userRepository.findOne(userId);
  }

  async createUser({ username, email, password }: SignUpInput) {
    try {
      const existUser = await this.userRepository.findOne({
        where: [{ email }, { username }],
      });
      if (existUser) {
        return {
          error: '이미 등록된 정보 입니다.',
        };
      }
      const hashedPassword = await bcrypt.hash(
        password,
        +this.configService.get('HASH_ROUNDS'),
      );
      const newUser = this.userRepository.create({
        username,
        email,
        password: hashedPassword,
      });
      await this.userRepository.save(newUser);
      const token = this.authService.sign(newUser.id);
      return {
        error: null,
        token,
      };
    } catch (error) {
      return {
        error: error.message,
      };
    }
  }

  async verifyUser({ email, password }: SignInInput) {
    try {
      const user = await this.userRepository.findOne({ email });
      if (!user)
        return { error: '가입하지 않은 이메일이거나, 잘못된 비밀번호입니다.' };
      const compared = await bcrypt.compare(password, user.password);
      if (compared) {
        const token = this.authService.sign(user.id);
        return { token, error: null };
      } else {
        return { error: '가입하지 않은 이메일이거나, 잘못된 비밀번호입니다.' };
      }
    } catch (error) {
      return {
        error: error.message,
      };
    }
  }
}
