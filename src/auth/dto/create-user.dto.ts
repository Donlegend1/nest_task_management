import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'Fullname',
    example: 'john_doe',
  })
  @IsString()
  @IsNotEmpty()
  fullname: string;
    @ApiProperty({
    description: 'Username',
    example: 'john_doe',
  })
  @IsString()
  @IsNotEmpty()
  username: string;
  
   @ApiProperty({
    description: 'Email',
    example: 'john_doe@gmail.com',
  })
  @IsString()
   @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Password',
    example: 'securepassword123',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
