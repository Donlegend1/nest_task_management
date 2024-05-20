import { Controller, Post, Get, Put, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@ApiTags('auth')
@ApiBearerAuth()
// @UseGuards(JwtAuthGuard)
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'The user has been successfully registered.' })
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

 @Post('login')
  async login(@Body() loginUserDto: LoginUserDto, @Res() res: Response) {
    try {
      const { accessToken, user } = await this.authService.login(loginUserDto, res);
      res.cookie('jwt', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Ensure cookies are secure in production
        maxAge: parseInt(process.env.LOGIN_SESSION_TIME) * 1000, // Convert to milliseconds
      });
      res.status(HttpStatus.CREATED).json({
        data: { token: accessToken, user },
        success: true,
        message: 'Login was successful.',
        detail: 'User login was successful.',
      });
    } catch (error) {
      res.status(HttpStatus.UNAUTHORIZED).json({
        data: [],
        success: false,
        message: error.message,
        detail: error.message,
      });
    }
  }

  @Get('profile')
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ status: 200, description: 'Return the authenticated user profile.' })
  async getProfile(@Req() req) {
    return this.authService.getProfile(req.user);
  }

  @Put('update/:id')
  @ApiOperation({ summary: 'Update a user' })
  @ApiParam({ name: 'id', description: 'ID of the user to update' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: 'The user has been successfully updated.' })
  async updateUser(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto, @Req() req) {
    return this.authService.updateUser(id, updateUserDto, req.user);
  }

  @Delete('delete/:id')
  @ApiOperation({ summary: 'Delete a user' })
  @ApiParam({ name: 'id', description: 'ID of the user to delete' })
  @ApiResponse({ status: 200, description: 'The user has been successfully deleted.' })
  async deleteUser(@Param('id') id: number, @Req() req) {
    return this.authService.deleteUser(id, req.user);
  }
}
