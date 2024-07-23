interface Player {
  name: string
  health: number
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
