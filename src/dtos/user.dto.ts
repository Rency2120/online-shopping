import { IsEmail, IsString, IsNotEmpty, MinLength, MaxLength, IsInt, Min, Max } from "class-validator";

export class CreateUserDto {
  @IsEmail()
  public email: string;

  @IsNotEmpty()
  public name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8, {
    message: "Password must be longer than or equal to 8 characters",
  })
  @MaxLength(32)
  public password: string;

  @IsInt({ message: "mobileNumber must be an integer" })
  @Min(1000000000, { message: "mobileNumber must have at least 10 digits" })
  @Max(9999999999, { message: "mobileNumber must have at most 10 digits" })
  public mobileNumber: number;
}

export class LoginUserDto {
  @IsEmail()
  public email: string;
  @IsString()
  @IsNotEmpty()
  @MinLength(8, {
    message: "Password must be longer than or equal to 8 characters",
  })
  @MaxLength(32)
  public password: string;
}