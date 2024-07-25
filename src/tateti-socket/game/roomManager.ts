// room-manager.ts
import { Room } from './room'
import type { CreateRoomService, JoinRoomService, Room as RoomType } from '../interfaces/game'

export class RoomManager {
  private rooms: Room[] = []
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
    const room = new Room(roomId, type)
    room.addPlayer(player, clientId)
    this.rooms.push(room)
    return this.createResponse(true, room, this.messages.roomCreated)
  }

  findAvailablePublicRoom() {
    const room = this.rooms.find((room) => room.type === 'public' && room.players.some((player) => player.name === ''))
    return room ? room.id : null
  }

  joinRoom(data: JoinRoomService) {
    const { playerName, roomId, clientId } = data
    const room = this.rooms.find((room) => room.id === roomId)
    if (!room) return this.createResponse(false, null, this.messages.roomNotFound)
    if (!room.addPlayer(playerName, clientId)) return this.createResponse(false, room, this.messages.roomFull)
    return this.createResponse(true, room, this.messages.playerJoined)
  }

  leaveRoom(roomId: string, playerName: string) {
    const roomIndex = this.rooms.findIndex((room) => room.id === roomId)
    if (roomIndex === -1) return this.createResponse(false, null, this.messages.roomNotFound)
    const room = this.rooms[roomIndex]
    if (!room.removePlayer(playerName)) return this.createResponse(false, room, this.messages.roomNotFound)
    if (room.isEmpty()) this.rooms.splice(roomIndex, 1)

    return this.createResponse(true, room, this.messages.playerLeft)
  }
  disconnectRoom(clientId: string) {
    for (let i = 0; i < this.rooms.length; i++) {
      const room = this.rooms[i]
      if (room.removePlayerByClientId(clientId)) {
        if (room.isEmpty()) this.rooms.splice(i, 1)
        break
      }
    }
  }

  getRooms(): RoomType[] {
    return this.rooms.map((room) => ({
      id: room.id,
      type: room.type,
      players: room.players
    }))
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
