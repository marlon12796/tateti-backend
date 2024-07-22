import { Module } from "@nestjs/common";
import { TatetiSocketGateway } from "./tateti-socket.gateway";

@Module({
	providers: [TatetiSocketGateway],
	controllers: [],
	imports: [],
})
export class TatetiSocketGatewayModule {}
