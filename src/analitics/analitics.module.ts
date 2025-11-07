import { Module } from '@nestjs/common';
import { AnaliticsService } from './analitics.service';
import { AnaliticsController } from './analitics.controller';
import { AnaliticProviders } from 'src/providers/analiticProvider';

@Module({
  controllers: [AnaliticsController],
  providers: [AnaliticsService,...AnaliticProviders],
})
export class AnaliticsModule {}
