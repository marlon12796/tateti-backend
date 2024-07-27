import { VictoryChecker } from 'src/utils/victoryChecker'
import { BOARD_POSITION, GameState, MakeMove, PlayerTurn, Room as RoomType } from '../interfaces/game'

export class Room {
  readonly id: RoomType['id']
  readonly type: RoomType['type']
  players: RoomType['players']
  state: GameState
  board: (PlayerTurn | '')[]
  initialPlayer: PlayerTurn

  constructor(id: RoomType['id'], type: RoomType['type']) {
    this.id = id
    this.type = type
    this.players = [
      { name: '', health: 3, clientId: '' },
      { name: '', health: 0, clientId: '' }
    ]
    this.initialPlayer = PlayerTurn.PLAYER_1
    this.state = GameState.WAITING_FOR_PARTNER
    this.board = Array(9).fill('')
  }

  addPlayer(name: string, clientId: string, isInitialCreate = false): boolean {
    const emptySlotIndex = this.players.findIndex((player) => player.name === '')
    if (emptySlotIndex === -1) return false
    if (!isInitialCreate) this.toggleState()

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

  movePlayer(player: MakeMove['playerPosition'], boardPosition: BOARD_POSITION): boolean {
    if (
      (player === PlayerTurn.PLAYER_1 && this.state !== GameState.TURN_PLAYER1) ||
      (player === PlayerTurn.PLAYER_2 && this.state !== GameState.TURN_PLAYER2)
    )
      return false

    if (boardPosition < 0 || boardPosition >= 9 || this.board[boardPosition] !== '') return false
    this.board[boardPosition] = player
    this.toggleTurn(player)
    const result = VictoryChecker.checkVictory({ board: this.board, player })
    if (result === 'DRAW') this.setState(GameState.DRAW)
    if (typeof result !== 'string' && result?.combination) {
      this.decreaseHealth(player)
    }
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
    this.setState(currentTurn === PlayerTurn.PLAYER_1 ? GameState.TURN_PLAYER2 : GameState.TURN_PLAYER1)
  }

  private toggleState(): void {
    this.setState(this.state === GameState.TURN_PLAYER1 ? GameState.TURN_PLAYER2 : GameState.TURN_PLAYER1)
  }
  private decreaseHealth(winner: PlayerTurn): void {
    const loserIndex = winner === PlayerTurn.PLAYER_1 ? PlayerTurn.PLAYER_2 : PlayerTurn.PLAYER_1

    const loser = this.players[loserIndex]
    if (loser.health > 0) {
      loser.health -= 1
      const totalWinner = winner === PlayerTurn.PLAYER_1 ? GameState.FINAL_VICTORY_PLAYER1 : GameState.FINAL_VICTORY_PLAYER2
      const partialWinner = winner === PlayerTurn.PLAYER_1 ? GameState.VICTORY_PLAYER1 : GameState.VICTORY_PLAYER2
      const newState = loser.health === 0 ? totalWinner : partialWinner
      this.setState(newState)
    }
  }
  isEmpty(): boolean {
    return this.players.every((player) => player.name === '')
  }

  setState(newState: GameState): void {
    this.state = newState
  }
}
