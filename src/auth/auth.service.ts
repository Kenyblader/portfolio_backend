import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Profile } from 'src/models/profile';
import { User } from 'src/models/user';



@Injectable()
export class AuthService {
    async getProfile(): Promise<Profile> {
        const data = await this.userRepository.findAll();
        const user = data[0];
        return {
            github: user.github,
            linkedin: user.linkedin,
            email: user.email,
        };
    }
    constructor(
        @Inject('USER_REPOSITORY') private userRepository: typeof User,
        private jwtService:JwtService
    ) {}

    async login(username: string, password: string): Promise<string> {
        return new Promise(async (resolve, reject) => {
            const user = await this.userRepository.findOne({ where: { username } });
        if (user && user.password === password) {
            const payload={ sub: user.id, username:user.username}
            const tocken= await this.jwtService.signAsync(payload);
            resolve(tocken);
        }
        else
            throw new  UnauthorizedException()
        });
    }

    async updateProfile(userId: string, githubUrl: string, linkedinUrl: string, email: string): Promise<Omit<User, 'password'>> {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (user) {
            user.github = githubUrl;
            user.linkedin = linkedinUrl;
            user.email = email;
            await user.save();
            return user;
        }
        throw new Error('User not found');
    }
}
