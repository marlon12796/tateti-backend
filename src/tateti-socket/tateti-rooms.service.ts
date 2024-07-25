import { Injectable } from '@nestjs/common'
import type { CreateRoomService, JoinRoomService, Room } from './interfaces/game'

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
  createRoom(data: CreateRoomService) {
    const { player, type, clientId } = data
    const roomId = this.generateRoomId()
    const newRoom: Room = {
      id: roomId,
      type,
      players: [
        { name: player, health: 3, clientId: clientId },
        { name: '', health: 3, clientId: '' }
      ]
    }
    this.rooms.push(newRoom)
    return this.createResponse(true, newRoom, this.messages.roomCreated)
  }

  findAvailablePublicRoom() {
    const room = this.rooms.find((room) => room.type === 'public' && (!room.players[0].name || !room.players[1].name))
    return room ? room.id : null
  }

  joinRoom(data: JoinRoomService) {
    const { playerName, roomId, clientId } = data
    const roomIndex = this.rooms.findIndex((room) => room.id === roomId)
    const room = this.rooms[roomIndex]

    if (roomIndex === -1) return this.createResponse(false, null, this.messages.roomNotFound)
    if (room.players[0].name && room.players[1].name) return this.createResponse(false, room, this.messages.roomFull)
    const playerIndex = room.players[0].name ? 1 : 0
    this.rooms[roomIndex].players[playerIndex] = {
      ...room.players[playerIndex],
      clientId,
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
        name: '',
        clientId: ''
      }
    }
    if (!room.players[0].name && !room.players[1].name) this.rooms.splice(roomIndex, 1)

    return this.createResponse(true, room, this.messages.playerLeft)
  }

  disconnectRoom(clientId: string) {
    for (let i = 0; i < this.rooms.length; i++) {
      const room = this.rooms[i]
      const playerIndex = room.players.findIndex((player) => player.clientId === clientId)
      if (playerIndex !== -1) {
        room.players[playerIndex] = {
          health: 3,
          name: '',
          clientId: ''
        }
        if (!room.players[0].name && !room.players[1].name) this.rooms.splice(i, 1)
        break
      }
    }
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
