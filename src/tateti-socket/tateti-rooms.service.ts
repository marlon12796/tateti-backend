import { Injectable } from '@nestjs/common'
import type { CreateRoom, JoinRoom, Room } from './interfaces/game'

@Injectable()
export class RoomService {
  private readonly rooms: Room[] = []
  createRoom(data: CreateRoom) {
    const { player, type } = data
    const roomId = this.generateRoomId()
    const newRoom: Room = {
      id: roomId,
      type,
      players: [
        { name: player, health: 3 },
        { name: '', health: 3 }
      ]
    }
    this.rooms.push(newRoom)
    return {
      success: true,
      room: newRoom,
      message: 'Sala creada exitosamente'
    }
  }
  findAvailablePublicRoom() {
    const room = this.rooms.find((room) => room.type === 'public' && (!room.players[0].name || !room.players[1].name))
    return room ? room.id : null
  }
  joinRoom(data: JoinRoom) {
    const { playerName, roomId } = data
    const roomIndex = this.rooms.findIndex((room) => room.id === roomId)
    const room = this.rooms[roomIndex]
    if (roomIndex === -1) {
      return {
        success: false,
        room,
        message: 'Sala no encontrada'
      }
    }
    if (room.players[0].name && room.players[1].name) {
      return {
        success: false,
        room,
        message: 'La sala está llena'
      }
    }
    const playerIndex = room.players[0].name ? 1 : 0
    this.rooms[roomIndex].players[playerIndex] = {
      ...room.players[playerIndex],
      name: playerName
    }
    return {
      success: true,
      room: this.rooms[roomIndex],
      message: 'Jugador unido exitosamente'
    }
  }
  getRooms(): Room[] {
    return this.rooms
  }
  private generateRoomId() {
    return crypto.randomUUID()
  }
}
