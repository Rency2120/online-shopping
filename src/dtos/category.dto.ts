import { IsString, IsNotEmpty, IsOptional, IsUrl, Length } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  @Length(3, 100, { message: 'Name must be between 3 and 100 characters' })
  public name!: string;

  @IsString()
  @IsNotEmpty({ message: 'Image URL is required' })
  public image!: string;
}

export class UpdateCategoryDto {
  @IsOptional()  
  @IsString()
  @Length(3, 100)
  public name?: string;

  @IsOptional()
  @IsString()
  @Length(10, 255)
  public description?: string;

  @IsOptional()
  @IsString()
  @IsUrl()
  public image?: string;
}
