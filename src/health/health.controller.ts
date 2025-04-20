import { Controller, Get } from '@nestjs/common';
import { Public } from '../auth/public.decorator';

@Controller()
export class HealthController {

  @Get('/health')
  @Public()
  getHealth() {
    return { status: 'ok' };
  }
}
