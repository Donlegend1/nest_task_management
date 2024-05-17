import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({
    description: 'Title of the task',
    example: 'Complete project documentation',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Description of the task',
    example: 'Write detailed documentation for the project, including all modules and APIs',
  })
  @IsString()
  @IsNotEmpty()
    description: string;
    
    
}
