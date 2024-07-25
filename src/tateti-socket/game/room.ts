import { type Room as RoomType } from '../interfaces/game'
export class Room {
  id: RoomType['id']
  type: RoomType['type']
  players: RoomType['players']

  constructor(id: RoomType['id'], type: RoomType['type']) {
    this.id = id
    this.type = type
    this.players = [
      { name: '', health: 3, clientId: '' },
      { name: '', health: 3, clientId: '' }
    ]
  }

  addPlayer(name: string, clientId: string) {
    const emptySlotIndex = this.players.findIndex((player) => player.name === '')
    if (emptySlotIndex === -1) return false // No empty slot available
    this.players[emptySlotIndex] = { name, health: 3, clientId }
    return true
  }

  removePlayer(name: string) {
    const playerIndex = this.players.findIndex((player) => player.name === name)
    if (playerIndex === -1) return false
    this.players[playerIndex] = { name: '', health: 3, clientId: '' }
    return true
  }
  removePlayerByClientId(clientId: string) {
    const playerIndex = this.players.findIndex((player) => player.clientId === clientId)
    if (playerIndex === -1) return false
    this.players[playerIndex] = { name: '', health: 3, clientId: '' }
    return true
  }

  isEmpty(): boolean {
    return this.players.every((player) => player.name === '')
  }
}
