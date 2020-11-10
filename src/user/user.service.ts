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

  async findOneById(id: number, relations?: string[]) {
    if (relations) {
      return await this.userRepository.findOne({
        where: { id },
        relations: [...relations],
      });
    } else {
      return await this.userRepository.findOne(id);
    }
  }

  async createUser({ username, email, password }: SignUpInput) {
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
    return this.authService.sign(newUser.id);
  }

  async verifyUser({ email, password }: SignInInput) {
    const user = await this.userRepository.findOne({ email });
    if (!user) {
      throw new Error('가입하지 않은 이메일이거나, 잘못된 비밀번호입니다.');
    } else {
      const compared = await bcrypt.compare(password, user.password);
      if (compared) {
        return this.authService.sign(user.id);
      } else {
        throw new Error('가입하지 않은 이메일이거나, 잘못된 비밀번호입니다.');
      }
    }
  }

  async editAvatar(user: User, avatarUrl: string) {
    user.avatar = avatarUrl;
    await this.userRepository.save(user);
  }

  async findOneByInfomation(email: string, username: string) {
    return await this.userRepository.findOne({
      where: [{ email }, { username }],
    });
  }
}
