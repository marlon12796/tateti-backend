import { GameState, PlayerTurn, Room as RoomType } from '../interfaces/game'
export class Room {
  id: RoomType['id']
  type: RoomType['type']
  players: RoomType['players']
  state: GameState
  playerTurn: PlayerTurn

  constructor(id: RoomType['id'], type: RoomType['type']) {
    this.id = id
    this.type = type
    this.players = [
      { name: '', health: 3, clientId: '' },
      { name: '', health: 0, clientId: '' }
    ]
    this.playerTurn = PlayerTurn['PLAYER_1']
    this.state = GameState['WAITING_FOR_PARTNER']
  }

  addPlayer(name: string, clientId: string, isInitialCreate: boolean = false) {
    const emptySlotIndex = this.players.findIndex((player) => player.name === '')
    if (emptySlotIndex === -1) return false // No empty slot available
    if (!isInitialCreate) this.switchTurn()

    this.players[emptySlotIndex] = { name, health: 3, clientId }
    return true
  }

  removePlayer(name: string) {
    const playerIndex = this.players.findIndex((player) => player.name === name)
    if (playerIndex === -1) return false
    this.players[playerIndex] = { name: '', health: 0, clientId: '' }
    this.setState(GameState['ABANDONED'])
    return true
  }
  removePlayerByClientId(clientId: string) {
    const playerIndex = this.players.findIndex((player) => player.clientId === clientId)
    if (playerIndex === -1) return false
    this.players[playerIndex] = { name: '', health: 0, clientId: '' }
    this.setState(GameState['ABANDONED'])
    return true
  }
  switchTurn() {
    this.playerTurn = this.playerTurn === PlayerTurn['PLAYER_1'] ? PlayerTurn['PLAYER_2'] : PlayerTurn['PLAYER_1']
    this.setState(this.playerTurn === PlayerTurn['PLAYER_1'] ? GameState['TURN_PLAYER2'] : GameState['TURN_PLAYER1'])
  }
  isEmpty() {
    return this.players.every((player) => player.name === '')
  }
  setState(newState: GameState) {
    this.state = newState
  }
}
