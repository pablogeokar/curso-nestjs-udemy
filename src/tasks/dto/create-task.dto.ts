import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateTaskDto {
  @IsString({ message: 'O nome precisa ser um texto' })
  @MinLength(5, { message: 'O nome precisa ter no mínimo 5 caracteres' })
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @MinLength(5)
  @IsNotEmpty()
  readonly description: string;
}
