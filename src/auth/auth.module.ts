import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { userProviders } from 'src/providers/user.providers';
import { JwtModule } from '@nestjs/jwt';
import { CONSTANTS } from './constant';

@Module({
  imports:[
    JwtModule.register({
      global:true,
      secret: CONSTANTS.jwtKey ,
      signOptions:{
        expiresIn:'1200s'
      }
    })
  ],
  providers: [ AuthService,...userProviders],
  controllers: [AuthController],
  
})
export class AuthModule {}