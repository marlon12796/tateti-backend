import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { RoomService } from './tateti-rooms.service'
import type { CreateRoom } from './interfaces/game'
@WebSocketGateway({
  cors: {
    origin: '*'
  }
})
export class TatetiSocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private server: Server
  constructor(private readonly roomService: RoomService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`)
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`)
  }

  @SubscribeMessage('searchRoom')
  handleSearchRoom() {
    const availableRoom = this.roomService.findAvailablePublicRoom()
    return { roomId: availableRoom }
  }
  @SubscribeMessage('createRoom')
  handleCreateRoom(@ConnectedSocket() client: Socket, @MessageBody() data: CreateRoom) {
    const availableRoom = this.roomService.createRoom(data)
    client.join(availableRoom.room.id)
    return availableRoom
  }
}
