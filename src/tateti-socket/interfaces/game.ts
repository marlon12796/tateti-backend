interface Player {
  name: string
  health: number
  clientId: string
}
type TypeRoom = 'public' | 'private'
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
