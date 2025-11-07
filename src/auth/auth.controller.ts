import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from 'src/models/user';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}
    @HttpCode(HttpStatus.OK)
    @Post('login')
    async login(@Body() params) {
        const { username, password } = params;
        console.log('Login attempt for user:', username, password);
        try {
            const response = await this.authService.login(username, password);
            return { token:response, isloggedIn: true };
        } catch (error) {
            return { isloggedIn: false, message: error };
        }
    }

    @Get('profile')
    async getProfile(): Promise<any> {
        return await this.authService.getProfile();
    }
}
