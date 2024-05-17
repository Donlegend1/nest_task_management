import { IsString, IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTaskDto {
  @ApiProperty({
    description: 'Title of the task',
    example: 'Buy groceries',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Description of the task',
    example: 'Milk, Bread, Butter, Eggs',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Status of the task',
    enum: ['pending', 'in-progress', 'completed'],
    example: 'pending',
  })
  @IsEnum(['pending', 'in-progress', 'completed'], {
    message: 'status must be either pending, in-progress or completed',
  })
  status: 'pending' | 'in-progress' | 'completed';
}
