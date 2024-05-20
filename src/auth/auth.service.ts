import { Injectable, NotFoundException, ForbiddenException, UnauthorizedException, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from './user.entity/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { PassThrough } from 'stream';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    return this.usersRepository.save(user);
  }
 async login(
    loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ accessToken: string; user: User }> {
    const { username, password } = loginUserDto;

    const user = await this.usersRepository.findOne({
      where: { username },
    });

    if (!user) {
      throw new UnauthorizedException('Authentication failed. User not found.');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Authentication failed. Wrong password.');
    }

    const payload = { username: user.username, sub: user.id };
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.LOGIN_SECRET_TOKEN_VALUE,
      expiresIn: process.env.LOGIN_SESSION_TIME,
    });

    // Set the JWT in a HttpOnly cookie
    response.cookie('jwt', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Ensure cookies are secure in production
      maxAge: parseInt(process.env.LOGIN_SESSION_TIME) * 1000, // Convert to milliseconds
    });

    return { accessToken: 'JWT ' + accessToken, user };
  }

  async getProfile(user: User): Promise<User> {
    const foundUser = await this.usersRepository.findOne({ where: { id: user.id } });
    if (!foundUser) {
      throw new NotFoundException('User not found');
    }
    return foundUser;
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto, currentUser: User): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.id !== currentUser.id) {
      throw new ForbiddenException('You can only update your own profile');
    }

    if (updateUserDto.password) {
      user.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    if (updateUserDto.username) {
      user.username = updateUserDto.username;
    }
    
    return this.usersRepository.save(user);
  }

  async deleteUser(id: number, currentUser: User): Promise<void> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.id !== currentUser.id) {
      throw new ForbiddenException('You can only delete your own profile');
    }

    await this.usersRepository.remove(user);
  }
}
