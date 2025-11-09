import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { ProjectModule } from './project/project.module';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AnaliticsModule } from './analitics/analitics.module';

@Module({
  imports: [DatabaseModule, ServeStaticModule.forRoot(
    {
      rootPath: join(process.cwd(), '..', 'uploads'),
      serveRoot: '/files',
    },

  ),
  ConfigModule.forRoot({
    isGlobal:true,
    envFilePath:'.env'
  }) ,AuthModule, ProjectModule, AnaliticsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
