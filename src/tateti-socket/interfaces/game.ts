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
export type GameState =
  | 'WAITING_FOR_PARTNER'
  | 'TURN_PLAYER1'
  | 'TURN_PLAYER2'
  | 'DRAW'
  | 'VICTORY_PLAYER1'
  | 'VICTORY_PLAYER2'
  | 'ABANDONED'
  | 'FINAL_VICTORY_PLAYER1'
  | 'FINAL_VICTORY_PLAYER2'
// ----player

export enum PlayerTurn {
  PLAYER_1 = 0,
  PLAYER_2 = 1
}
