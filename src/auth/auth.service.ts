import { Inject, Injectable } from '@nestjs/common';
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
    ) {}

    async login(username: string, password: string): Promise<Omit<User,'password'>> {
        return new Promise(async (resolve, reject) => {
            const user = await this.userRepository.findOne({ where: { username } });
        if (user && user.password === password) {
            resolve(user);
        }
        reject('Invalid credentials');
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
