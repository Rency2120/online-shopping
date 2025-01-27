import { Request } from "express";
import { UserAttributes } from "@interfaces/users.interface";

export interface DataStoredInToken {
  id: string;
  role: Number;
  email: string;
}

export interface TokenData {
  token: string;
  expiresIn: string;
}

export interface RequestWithUser extends Request {
  user: UserAttributes;
}
