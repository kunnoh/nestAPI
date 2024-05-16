import { Controller, Get } from '@nestjs/common';
import {
  DiskHealthIndicator,
  HealthCheck,
  HealthCheckResult,
  HealthCheckService,
  HttpHealthIndicator,
  MemoryHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly disk: DiskHealthIndicator,
    private http: HttpHealthIndicator,
    private db: TypeOrmHealthIndicator,
    private memory: MemoryHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  Check(): Promise<HealthCheckResult> {
    return this.health.check([
      () =>
        this.http.responseCheck(
          'nestjs-docs',
          'https://docs.nestjs.com',
          (res) => res.status === 200,
        ),
    ]);
  }

  @Get('/orm')
  @HealthCheck()
  CheckOrm(): Promise<HealthCheckResult> {
    return this.health.check([() => this.db.pingCheck('database')]);
  }

  @Get('/disk')
  @HealthCheck()
  checkDisk() {
    return this.health.check([
      () =>
        this.disk.checkStorage('storage', {
          path: '/',
          thresholdPercent: 0.7,
        }),
    ]);
  }

  @Get('/memory')
  @HealthCheck()
  checkMem() {
    return this.health.check([
      () => this.memory.checkHeap('memory_Heap', 150 * 1024 * 1024),
      () => this.memory.checkRSS('memory_rss', 150 * 1024 * 1024),
    ]);
  }
}
