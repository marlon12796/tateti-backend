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
}
export interface CreateRoom {
  player: string
  type: TypeRoom
}
export interface JoinRoom {
  roomId: Room['id']
  playerName: string
}

// ---- union
export type CreateRoomService = CreateRoom & {
  clientId: string
}
export type JoinRoomService = JoinRoom & {
  clientId: string
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

// ----player

export const enum PlayerTurn {
  PLAYER_1 = 0,
  PLAYER_2 = 1
}
