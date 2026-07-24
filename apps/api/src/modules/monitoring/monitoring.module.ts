import { Module, Global } from '@nestjs/common';
import { ErrorStoreService } from '../../common/filters/error-store.service';
import { MonitoringController } from './monitoring.controller';

@Global()
@Module({
  controllers: [MonitoringController],
  providers: [ErrorStoreService],
  exports: [ErrorStoreService],
})
export class MonitoringModule {}
