// biome-ignore lint/style/useImportType: <explanation>
import {
	MessageBody,
	OnGatewayConnection,
	OnGatewayDisconnect,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from "@nestjs/websockets";
// biome-ignore lint/style/useImportType: <explanation>
import { Server, Socket } from "socket.io";
// biome-ignore lint/style/useImportType: <explanation>
import { RoomService } from "./tateti-rooms.service";

@WebSocketGateway({
	cors: {
		origin: "*",
	},
})
export class TatetiSocketGateway
	implements OnGatewayConnection, OnGatewayDisconnect
{
	@WebSocketServer()
	private server: Server;
	constructor(private readonly roomService: RoomService) {}

	handleConnection(client: Socket) {
		console.log(`Client connected: ${client.id}`);
	}

	handleDisconnect(client: Socket) {
		console.log(`Client disconnected: ${client.id}`);
	}

	@SubscribeMessage("searchRoom")
	handleSearchRoom(client: Socket,@MessageBody() data: string){
		const availableRoom=this.roomService.findAvailablePublicRoom()
		console.log(availableRoom)

		return "Hello world!";
	}
}
