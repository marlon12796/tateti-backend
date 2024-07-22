// biome-ignore lint/style/useImportType: <explanation>
import {
	OnGatewayConnection,
	OnGatewayDisconnect,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from "@nestjs/websockets";
// biome-ignore lint/style/useImportType: <explanation>
import { Server, Socket } from "socket.io";

@WebSocketGateway()
export class TatetiSocketGateway
	implements OnGatewayConnection, OnGatewayDisconnect
{
	@WebSocketServer()
	private server: Server;

	handleConnection(client: Socket) {
		console.log(`Client connected: ${client.id}`);
	}

	handleDisconnect(client: Socket) {
		console.log(`Client disconnected: ${client.id}`);
	}

	// @SubscribeMessage("message")
	// handleMessage(client: Socket): string {
	// 	console.log(`Message received from ${client.id}`);

	// 	return "Hello world!";
	// }
}
