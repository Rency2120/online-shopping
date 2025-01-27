import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { Routes } from '@/interfaces/routes.interface';
import { CreateUserDto, LoginUserDto } from '@/dtos/user.dto';
import { ValidationMiddleware } from '@/middlewares/validation.middleware';
import { AuthMiddleware, isAdmin } from '@/middlewares/auth.middleware';


export class routerUser implements Routes {
    public path = "/User"
    public router = Router();
    public user = new UserController();

    constructor() {
        this.initializeRoutes();
        console.log("initializeRoutes", this.initializeRoutes)
    }

    private initializeRoutes() {
        this.router.post(`${this.path}/add`, ValidationMiddleware(CreateUserDto), this.user.createUser);
        this.router.get(`${this.path}/:id`, this.user.getUserById);
        this.router.put(`${this.path}/:id`, this.user.updateUser);
        this.router.get(`${this.path}/all/user`, this.user.getAll)
        this.router.post(`${this.path}/login`, ValidationMiddleware(LoginUserDto), this.user.loginUser);
        this.router.delete(`${this.path}/:id`, this.user.delete)
        this.router.post(`${this.path}/forgot/password`, this.user.forgotPassword)
        this.router.get(`${this.path}/reset-token/:token`, this.user.resetPasswordPage)
        this.router.post(`${this.path}/reset/password`, this.user.resetPassword)
        this.router.post(`${this.path}/verify/otp`, AuthMiddleware, this.user.verifyOtp)


        this.router.post(`${this.path}/admin/assign-role`, AuthMiddleware, isAdmin, this.user.assignAdminRole)

    }
}
// this.router.post(`${this.path}/:token`, this.user.verifyEmail)
