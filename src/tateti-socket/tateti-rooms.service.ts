import { Injectable } from '@nestjs/common'
import { RoomManager } from './game/roomManager'
import type { CreateRoomService, JoinRoomService } from './interfaces/game'

@Injectable()
export class RoomService {
  private readonly roomManager = new RoomManager()

  createRoom(data: CreateRoomService) {
    return this.roomManager.createRoom(data)
  }

  findAvailablePublicRoom() {
    return this.roomManager.findAvailablePublicRoom()
  }

  joinRoom(data: JoinRoomService) {
    return this.roomManager.joinRoom(data)
  }

  leaveRoom(roomId: string, clientId: string) {
    return this.roomManager.leaveRoom(roomId, clientId)
  }

  disconnectRoom(clientId: string) {
    this.roomManager.disconnectRoom(clientId)
  }

  getRooms() {
    return this.roomManager.getRooms()
  }
}
