import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { Repository } from 'typeorm';
import { SignInInput } from './dto/SignIn.dto';
import { SignUpInput } from './dto/SignUp.dto';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly authService: AuthService,
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

  async createUser(data: SignUpInput) {
    try {
      const existUser = await this.userRepository.findOne({
        where: [{ email: data.email }, { username: data.username }],
      });
      if (existUser) {
        return {
          error: '이미 등록된 정보 입니다.',
        };
      }
      const newUser = this.userRepository.create(data);
      await this.userRepository.save(newUser);
      const token = this.authService.sign(newUser.id);
      return {
        error: null,
        token,
      };
    } catch {
      return {
        error: '유저를 생성 할 수 없습니다.',
      };
    }
  }

  async verifyUser({ email, password }: SignInInput) {
    const user = await this.userRepository.findOne({ email });
    if (!user)
      return { error: '가입하지 않은 이메일이거나, 잘못된 비밀번호입니다.' };
    if (user.password === password) {
      const token = this.authService.sign(user.id);
      return { token, error: null };
    } else {
      return { error: '가입하지 않은 이메일이거나, 잘못된 비밀번호입니다.' };
    }
  }
}
