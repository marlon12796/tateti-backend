// room-manager.ts
import { Room } from './room'
import type { CreateResponse, CreateRoomService, JoinRoomService, MakeMove, Room as RoomType } from '../interfaces/game'

export class RoomManager {
  private rooms: Room[] = []
  private readonly messages = {
    roomNotFound: 'Sala no encontrada',
    roomFull: 'La sala está llena',
    roomCreated: 'Sala creada exitosamente',
    playerJoined: 'Jugador unido exitosamente',
    playerLeft: 'Jugador ha salido de la sala',
    playerInvalidPostion: 'Posición inválida para el movimiento',
    playerValidPostion: 'El jugador ha realizado su movimiento'
  }

  createRoom(data: CreateRoomService) {
    const { player, type, clientId } = data
    const roomId = crypto.randomUUID()
    const room = new Room(roomId, type)
    room.addPlayer(player, clientId, true)
    this.rooms.push(room)
    return this.createResponse({
      success: true,
      room,
      message: this.messages.roomCreated
    })
  }

  findAvailablePublicRoom() {
    const room = this.rooms.find((room) => room.type === 'public' && room.players.some((player) => player.name === ''))
    return room ? room.id : null
  }
  makeMoveRoom(data: MakeMove) {
    const room = this.rooms.find((room) => room.id === data.roomId)

    const isMove = room.movePlayer(data.playerPosition, data.boardPosition)
    return this.createResponse({
      success: isMove,
      room,
      message: !isMove ? this.messages.playerInvalidPostion : this.messages.playerValidPostion
    })
  }
  joinRoom(data: JoinRoomService) {
    const { playerName, roomId, clientId } = data
    const room = this.rooms.find((room) => room.id === roomId)
    if (!room)
      return this.createResponse({
        success: false,
        room: null,
        message: this.messages.roomNotFound
      })
    const playerAdded = room.addPlayer(playerName, clientId)
    return this.createResponse({
      success: playerAdded,
      room,
      message: playerAdded ? this.messages.playerJoined : this.messages.roomFull
    })
  }

  leaveRoom(roomId: string, playerName: string) {
    const roomIndex = this.rooms.findIndex((room) => room.id === roomId)
    if (roomIndex === -1)
      return this.createResponse({
        success: false,
        room: null,
        message: this.messages.roomNotFound
      })
    const room = this.rooms[roomIndex]
    if (!room.removePlayer(playerName))
      return this.createResponse({
        success: false,
        room,
        message: this.messages.roomNotFound
      })
    if (room.isEmpty()) this.rooms.splice(roomIndex, 1)

    return this.createResponse({
      success: true,
      room,
      message: this.messages.playerLeft
    })
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
      players: room.players,
      state: room.state,
      board: room.board,
      initialPlayer: room.initialPlayer
    }))
  }

  private createResponse({ success, room, message }: CreateResponse) {
    return {
      success,
      room,
      message
    }
  }
}
