import { BOARD_POSITION, GameState, MakeMove, PlayerTurn, Room as RoomType } from '../interfaces/game'

export class Room {
  readonly id: RoomType['id']
  readonly type: RoomType['type']
  players: RoomType['players']
  state: GameState
  playerTurn: PlayerTurn
  board: (PlayerTurn | '')[]

  constructor(id: RoomType['id'], type: RoomType['type']) {
    this.id = id
    this.type = type
    this.players = [
      { name: '', health: 3, clientId: '' },
      { name: '', health: 0, clientId: '' }
    ]
    this.playerTurn = PlayerTurn.PLAYER_1
    this.state = GameState.WAITING_FOR_PARTNER
    this.board = Array(9).fill('')
  }

  addPlayer(name: string, clientId: string, isInitialCreate = false): boolean {
    const emptySlotIndex = this.players.findIndex((player) => player.name === '')
    if (emptySlotIndex === -1) return false
    if (!isInitialCreate) this.switchTurn()

    this.players[emptySlotIndex] = { name, health: 3, clientId }
    return true
  }

  removePlayer(name: string): boolean {
    const playerIndex = this.players.findIndex((player) => player.name === name)
    if (playerIndex === -1) return false
    this.players[playerIndex] = { name: '', health: 0, clientId: '' }
    this.setState(GameState.ABANDONED)
    return true
  }

  movePlayer(position: MakeMove['playerPosition'], boardPosition: BOARD_POSITION): boolean {
    if (
      (position === PlayerTurn.PLAYER_1 && this.state !== GameState.TURN_PLAYER1) ||
      (position === PlayerTurn.PLAYER_2 && this.state !== GameState.TURN_PLAYER2)
    )
      return false

    if (boardPosition < 0 || boardPosition >= 9 || this.board[boardPosition] !== '') return false
    this.board[boardPosition] = position
    this.toggleTurn(position)
    return true
  }

  removePlayerByClientId(clientId: string): boolean {
    const playerIndex = this.players.findIndex((player) => player.clientId === clientId)
    if (playerIndex === -1) return false
    this.players[playerIndex] = { name: '', health: 0, clientId: '' }
    this.setState(GameState.ABANDONED)
    return true
  }

  private toggleTurn(currentTurn: PlayerTurn): void {
    this.playerTurn = currentTurn === PlayerTurn.PLAYER_1 ? PlayerTurn.PLAYER_2 : PlayerTurn.PLAYER_1
    this.setState(this.playerTurn === PlayerTurn.PLAYER_1 ? GameState.TURN_PLAYER1 : GameState.TURN_PLAYER2)
  }

  private switchTurn(): void {
    this.playerTurn = this.playerTurn === PlayerTurn.PLAYER_1 ? PlayerTurn.PLAYER_1 : PlayerTurn.PLAYER_2
    this.setState(this.playerTurn === PlayerTurn.PLAYER_1 ? GameState.TURN_PLAYER1 : GameState.TURN_PLAYER2)
  }

  isEmpty(): boolean {
    return this.players.every((player) => player.name === '')
  }

  setState(newState: GameState): void {
    this.state = newState
  }
}
