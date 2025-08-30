import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class UpdateUserGoalsDto {
  @IsInt()
  @IsNotEmpty()
  @Min(0)
  weeklyDocs: number;

  @IsInt()
  @IsNotEmpty()
  @Min(0)
  monthlyWords: number;
}
