interface Player {
  name: string
  health: number
  clientId: string
}
export type TypeRoom = 'public' | 'private'
export interface Room {
  id: `${string}-${string}-${string}-${string}-${string}`
  type: TypeRoom
  players: [Player, Player]
  state: GameState
  initialPlayer: PlayerTurn
  board: (PlayerTurn | '')[]
}
export interface CreateRoom {
  player: string
  type: TypeRoom
}
export interface JoinRoom {
  roomId: Room['id']
  playerName: string
}
export interface MakeMove {
  roomId: Room['id']
  playerPosition: PlayerTurn
  boardPosition: BOARD_POSITION
}
export interface NewTurn {
  roomId: Room['id']
}

// ---- union
export type CreateRoomService = CreateRoom & {
  clientId: string
}
export type JoinRoomService = JoinRoom & {
  clientId: string
}
export type CreateResponse = {
  success: boolean
  room: Room | null
  message: string
}
// -----------------game
export const enum GameState {
  WAITING_FOR_PARTNER = 'ESPERANDO_COMPAÑERO',
  TURN_PLAYER1 = 'TURNO_JUGADOR1',
  TURN_PLAYER2 = 'TURNO_JUGADOR2',
  DRAW = 'EMPATE',
  VICTORY_PLAYER1 = 'VICTORIA_JUGADOR1',
  VICTORY_PLAYER2 = 'VICTORIA_JUGADOR2',
  ABANDONED = 'ABANDONADO',
  FINAL_VICTORY_PLAYER1 = 'VICTORIA_FINAL_JUGADOR1',
  FINAL_VICTORY_PLAYER2 = 'VICTORIA_FINAL_JUGADOR2'
}

export type BOARD_POSITION = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8

// ----player

export const enum PlayerTurn {
  PLAYER_1 = 0,
  PLAYER_2 = 1
}
