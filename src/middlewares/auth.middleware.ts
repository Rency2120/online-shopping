import { NextFunction, Response, Request } from 'express';
import { verify } from 'jsonwebtoken';
import { SECRET_KEY } from '@config';
import { HttpException } from '@exceptions/httpException';
import { DataStoredInToken, RequestWithUser } from '@interfaces/auth.interface';
import User from '@models/user.Model';
import { UserAttributes } from '@/interfaces/users.interface';
import jwt from 'jsonwebtoken';
declare global {
  namespace Express {
    interface Request {
      user: any;
    }
  }
}

const getAuthorization = req => {
  const header = req.header('Authorization');
  const cookie = req.cookies['Authorization'];

  if (header && header.startsWith('Bearer ')) {
    return header.split(' ')[1];
  }

  if (cookie) return cookie;

  return null;
};
export const AuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const Authorization = getAuthorization(req);

    if (!Authorization) {
      return res.status(401).json({ message: 'Authentication Token Missing' });
    }

    const decoded = jwt.verify(Authorization, SECRET_KEY) as { id: number }; // Decoding JWT
    console.log('decoded', decoded);
    const findUser = await User.findByPk(decoded.id);

    if (!findUser) {
      return res.status(401).json({ message: 'User not found' });
    }

    // if (!findUser.verificationToken) {
    //   return res.status(401).json({ message: 'Invalid or Expired Token' });
    // }

    req.user = findUser; // Attach the user object to the request
    next(); // Proceed to the next middleware/route handler
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: 'Invalid or Expired Token' });
  }
};

export const isAdmin = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const Authorization = getAuthorization(req);

    if (!Authorization) {
      return next(new HttpException(404, 'Authentication Token Missing'));
    }

    const { id, role } = (await verify(Authorization, SECRET_KEY)) as UserAttributes;
    const findUser = await User.findByPk(id);
    console.log('findUser', findUser);

    console.log(' ROle', role);
    console.log('id', id);
    if (findUser.role !== 'ADMIN') {
      return next(new HttpException(401, 'Permission Denied'));
    }

    if (!findUser) {
      return next(new HttpException(401, 'Invalid authentication token'));
    }

    req.user = findUser;
    next();
  } catch (error) {
    next(new HttpException(401, 'Invalid or Expired Token'));
  }
};
