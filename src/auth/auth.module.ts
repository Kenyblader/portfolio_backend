import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { userProviders } from 'src/providers/user.providers';

@Module({
  providers: [ AuthService,...userProviders],
  controllers: [AuthController],
})
export class AuthModule {}
