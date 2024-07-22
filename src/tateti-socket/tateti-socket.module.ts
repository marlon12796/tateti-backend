import { Module } from "@nestjs/common";
import { TatetiSocketGateway } from "./tateti-socket.gateway";
import { RoomService } from "./tateti-rooms.service";

@Module({
	providers: [TatetiSocketGateway, RoomService],
	controllers: [],
	imports: [],
})
export class TatetiSocketGatewayModule {}
