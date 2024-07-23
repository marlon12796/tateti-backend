import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { TatetiSocketGatewayModule } from './tateti-socket/tateti-socket.module'

@Module({
  imports: [TatetiSocketGatewayModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
