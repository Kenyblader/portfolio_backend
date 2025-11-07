import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from 'src/models/user';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('login')
    async login(@Body() params): Promise<{ user?: Omit<User,'password'> ,isloggedIn: boolean, message?: string}> {
        const { username, password } = params;
        console.log('Login attempt for user:', username, password);
        try {
            const user = await this.authService.login(username, password);
            return { user, isloggedIn: true };
        } catch (error) {
            return { isloggedIn: false, message: error };
        }
    }

    @Get('profile')
    async getProfile(): Promise<any> {
        return await this.authService.getProfile();
    }
}
