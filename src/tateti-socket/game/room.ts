import { VictoryChecker } from 'src/utils/victoryChecker'
import { BOARD_POSITION, GameState, MakeMove, type Player, PlayerTurn, Room as RoomType } from '../interfaces/game'

export class Room {
  readonly id: RoomType['id']
  readonly type: RoomType['type']
  players: RoomType['players']
  state: GameState
  board: (PlayerTurn | '')[]
  initialPlayer: PlayerTurn
  votes: Set<PlayerTurn>

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
    this.votes = new Set()
  }

  /**
   * Adds a player to the room.
   *
   * @param name - The name of the player to be added.
   * @param clientId - The unique identifier of the player's client.
   * @param isInitialCreate - Indicates whether this is the initial creation of the room.
   *                          If true, the game state will not be toggled. Default is false.
   * @returns A boolean indicating whether the player was successfully added.
   */
  addPlayer(name: string, clientId: string, isInitialCreate = false): boolean {
    const emptySlotIndex = this.players.findIndex((player) => player.name === '')
    if (emptySlotIndex === -1) return false
    if (!isInitialCreate) this.toggleGameState()

    this.players[emptySlotIndex] = { name, health: 3, clientId }
    return true
  }

  removePlayer(name: string) {
    return this.removePlayerBy('name', name)
  }

  removePlayerByClientId(clientId: string) {
    return this.removePlayerBy('clientId', clientId)
  }

  private removePlayerBy(key: Player['name'] | Player['clientId'], value: string) {
    const playerIndex = this.players.findIndex((player) => player[key] === value)
    if (playerIndex === -1) return false

    const otherPlayerIndex = playerIndex === PlayerTurn.PLAYER_1 ? PlayerTurn.PLAYER_2 : PlayerTurn.PLAYER_1
    this.players[otherPlayerIndex].health = 3
    this.players[playerIndex] = { name: '', health: 0, clientId: '' }
    this.setState(GameState.ABANDONED)
    return true
  }
  /**
   * Attempts to make a move for the specified player at the given board position.
   *
   * @param player - The player making the move. Must be either PlayerTurn.PLAYER_1 or PlayerTurn.PLAYER_2.
   * @param boardPosition - The position on the game board where the player wants to place their mark.
   *                        Must be a valid index (0-8) and the position must be empty.
   *
   * @returns A boolean indicating whether the move was successful.
   *          Returns false if the game state does not allow the player to make a move,
   */
  movePlayer(player: MakeMove['playerPosition'], boardPosition: BOARD_POSITION): boolean {
    if (
      (player === PlayerTurn.PLAYER_1 && this.state !== GameState.TURN_PLAYER1) ||
      (player === PlayerTurn.PLAYER_2 && this.state !== GameState.TURN_PLAYER2)
    )
      return false
    if (boardPosition < 0 || boardPosition >= 9 || this.board[boardPosition] !== '') return false
    this.board[boardPosition] = player
    this.toggleGameState(player)
    const result = VictoryChecker.checkVictory({ board: this.board, player })
    if (result === 'DRAW') this.setState(GameState.DRAW)
    if (typeof result !== 'string' && result?.combination) this.decreaseHealth(player)

    return true
  }

  /**
   * Begins a new turn in the game.
   *
   * @returns A boolean indicating whether a new turn was successfully started.
   *          Returns false if the game is in a state where a new turn cannot be initiated.
   */
  newTurn() {
    if (this.state === GameState.FINAL_VICTORY_PLAYER1 || this.state === GameState.FINAL_VICTORY_PLAYER2) return false
    this.cleanBoard()
    this.setInitialPlayer(this.initialPlayer)
    this.setState(this.initialPlayer === PlayerTurn.PLAYER_1 ? GameState.TURN_PLAYER1 : GameState.TURN_PLAYER2)
    return true
  }

  cleanBoard() {
    this.board = Array(9).fill('')
  }
  //  votacion
  /**
   * Allows players to vote for a new game after a final victory.
   *
   * @param player - The player who is casting the vote. Must be either PlayerTurn.PLAYER_1 or PlayerTurn.PLAYER_2.
   *
   * @returns A boolean indicating whether the vote was successful.
   */
  voteForNewGame(player: PlayerTurn) {
    if (![GameState.FINAL_VICTORY_PLAYER1, GameState.FINAL_VICTORY_PLAYER2].includes(this.state)) return false
    if (this.votes.has(player)) return false
    this.votes.add(player)
    if (this.votes.size === 2) this.resetGame()

    return true
  }
  // Métodos Internos
  private toggleGameState(turn?: PlayerTurn) {
    turn !== undefined
      ? this.setState(turn === PlayerTurn.PLAYER_1 ? GameState.TURN_PLAYER2 : GameState.TURN_PLAYER1)
      : this.setState(this.state === GameState.TURN_PLAYER1 ? GameState.TURN_PLAYER2 : GameState.TURN_PLAYER1)
  }

  private decreaseHealth(winner: PlayerTurn) {
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

  isEmptyPlayers() {
    return this.players.every((player) => player.name === '')
  }

  setState(newState: GameState) {
    this.state = newState
  }
  setInitialPlayer(player: PlayerTurn) {
    this.initialPlayer = player === PlayerTurn.PLAYER_1 ? PlayerTurn.PLAYER_2 : PlayerTurn.PLAYER_1
  }
  private resetGame() {
    this.cleanBoard()
    this.setInitialPlayer(this.initialPlayer)
    this.setState(GameState.WAITING_FOR_PARTNER)
    this.votes.clear()
  }
}
