import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets'
import { Socket } from 'socket.io'
import { RoomService } from './tateti-rooms.service'
import { LeaveRoom, NewTurn, VoteForNewGame, type CreateRoom, type JoinRoom, type MakeMove } from './interfaces/game'
import { Namespace } from 'socket.io'
@WebSocketGateway({
  cors: {
    origin: [`http://localhost:${process.env.FRONTED_PORT ?? 4200}`, `http://localhost:${process.env.FRONTED_PORT ?? 8080}`],
    credentials: true,
    methods: ['GET', 'POST']
  },
  path:"/socket.io",
  pingInterval: 10000,
  pingTimeout: 15000
})
export class TatetiSocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private server: Namespace
  constructor(private readonly roomService: RoomService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`)
  }

  handleDisconnect(client: Socket) {
    this.roomService.disconnectRoom(client.id)
  }

  @SubscribeMessage('searchRoom')
  handleSearchRoom() {
    const availableRoom = this.roomService.findAvailablePublicRoom()
    return { roomId: availableRoom }
  }
  @SubscribeMessage('createRoom')
  handleCreateRoom(@ConnectedSocket() client: Socket, @MessageBody() data: CreateRoom) {
    const availableRoom = this.roomService.createRoom({ ...data, clientId: client.id })
    client.join(availableRoom.room.id)
    return availableRoom
  }

  @SubscribeMessage('joinRoom')
  handeJoinRoom(@ConnectedSocket() client: Socket, @MessageBody() data: JoinRoom) {
    const availableRoom = this.roomService.joinRoom({ ...data, clientId: client.id })
    if (availableRoom.success) {
      client.join(data.roomId)
      client.to(data.roomId).emit('playerJoined', {
        message: 'Un nuevo jugador se ha unido a la sala',
        room: availableRoom.room
      })
    }
    return availableRoom
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(@ConnectedSocket() client: Socket, @MessageBody() data: LeaveRoom) {
    client.leave(data.roomId)
    const { room } = this.roomService.leaveRoom(data.roomId, data.playerName)
    client.to(data.roomId).emit('playerLeft', { playerName: data.playerName, room, numberPlayer: data.numberPlayer })

    return { playerName: data.playerName, room, numberPlayer: data.numberPlayer }
  }
  @SubscribeMessage('makeMove')
  handleMakeMoveRoom(@ConnectedSocket() client: Socket, @MessageBody() data: MakeMove) {
    const response = this.roomService.makeMoveRoom(data)
    if (response.success) client.to(data.roomId).emit('makeMove', response.room)

    return response
  }
  @SubscribeMessage('newTurn')
  handleNewTurnRoom(@ConnectedSocket() client: Socket, @MessageBody() data: NewTurn) {
    const response = this.roomService.makeNewTurn(data)
    if (response.success) client.to(data.roomId).emit('newTurn', response.room)
    return response
  }
  @SubscribeMessage('voteForNewGame')
  handleVoteForNewGame(@ConnectedSocket() client: Socket, @MessageBody() data: VoteForNewGame) {
    const response = this.roomService.voteForNewGame(data)
    if (response.success) client.to(data.roomId).emit('voteForNewGame', response.room)
    return response
  }
}
