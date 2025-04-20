import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';

@Module({
  controllers: [HealthController],
  imports: [HealthModule]
})
export class HealthModule {}
