import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class HelloworldDTO {
  @IsNotEmpty()
  name: string;

  @IsInt()
  @IsNotEmpty()
  @Min(1)
  age: number;
}
