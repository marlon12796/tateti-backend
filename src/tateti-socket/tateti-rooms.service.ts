import { Injectable } from '@nestjs/common'
import type { CreateRoom, JoinRoom, Room } from './interfaces/game'

@Injectable()
export class RoomService {
  private readonly rooms: Room[] = []
  private readonly messages = {
    roomNotFound: 'Sala no encontrada',
    roomFull: 'La sala está llena',
    roomCreated: 'Sala creada exitosamente',
    playerJoined: 'Jugador unido exitosamente',
    playerLeft: 'Jugador ha salido de la sala'
  }
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
    return this.createResponse(true, newRoom, this.messages.roomCreated)
  }

  findAvailablePublicRoom() {
    const room = this.rooms.find((room) => room.type === 'public' && (!room.players[0].name || !room.players[1].name))
    return room ? room.id : null
  }

  joinRoom(data: JoinRoom) {
    const { playerName, roomId } = data
    const roomIndex = this.rooms.findIndex((room) => room.id === roomId)
    const room = this.rooms[roomIndex]

    if (roomIndex === -1) return this.createResponse(false, null, this.messages.roomNotFound)
    if (room.players[0].name && room.players[1].name) return this.createResponse(false, room, this.messages.roomFull)
    const playerIndex = room.players[0].name ? 1 : 0
    this.rooms[roomIndex].players[playerIndex] = {
      ...room.players[playerIndex],
      name: playerName
    }
    return this.createResponse(true, this.rooms[roomIndex], this.messages.playerJoined)
  }
  leaveRoom(roomId: string, playerName: string) {
    const roomIndex = this.rooms.findIndex((room) => room.id === roomId)
    if (roomIndex === -1) return this.createResponse(false, null, this.messages.roomNotFound)

    const room = this.rooms[roomIndex]
    const playerIndex = room.players.findIndex((player) => player.name === playerName)
    if (playerIndex !== -1) {
      room.players[playerIndex] = {
        health: 3,
        name: ''
      }
    }
    if (!room.players[0].name && !room.players[1].name) this.rooms.splice(roomIndex, 1)

    return this.createResponse(true, room, this.messages.playerLeft)
  }

  getRooms(): Room[] {
    return this.rooms
  }

  private generateRoomId() {
    return crypto.randomUUID()
  }
  private createResponse(success: boolean, room: Room | null, message: string) {
    return {
      success,
      room,
      message
    }
  }
}
