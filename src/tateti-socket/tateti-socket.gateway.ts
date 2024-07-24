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
import type { CreateRoom, JoinRoom } from './interfaces/game'
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

  @SubscribeMessage('joinRoom')
  handeJoinRoom(@ConnectedSocket() client: Socket, @MessageBody() data: JoinRoom) {
    const availableRoom = this.roomService.joinRoom(data)
    if (availableRoom.success) {
      client.join(data.roomId)
      this.server.to(data.roomId).emit('playerJoined', {
        message: 'Un nuevo jugador se ha unido a la sala',
        room: availableRoom.room
      })
    }
    return availableRoom
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(@ConnectedSocket() client: Socket, @MessageBody() data: { roomId: string; playerName: string }) {
    client.leave(data.roomId)
    const { room } = this.roomService.leaveRoom(data.roomId, data.playerName)
    client.to(data.roomId).emit('playerLeft', { playerName: data.playerName, room })
    return 'eliminado de la sala'
  }
}
