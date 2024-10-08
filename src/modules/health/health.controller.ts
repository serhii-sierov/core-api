import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { Response } from 'express';
import { HealthService } from './health.service';
import { TypedConfigService } from 'modules/shared/modules/config/config.service';

@Controller('health')
export class HealthController {
  constructor(
    private readonly healthService: HealthService,
    private readonly configService: TypedConfigService,
  ) {}

  @Get()
  //   @Public()
  status(@Res() res: Response): void {
    res.json({
      status: HttpStatus.OK,
      version: this.healthService.getAppVersion(),
      gitCommit: this.configService.get('GIT_COMMIT'),
    });
  }
}
