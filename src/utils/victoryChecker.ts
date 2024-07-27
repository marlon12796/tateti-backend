import { BOARD_POSITION, PlayerTurn } from 'src/tateti-socket/interfaces/game'
interface VictoryCheckerTypes {
  board: (PlayerTurn | '')[]
  player: PlayerTurn
}
export class VictoryChecker {
  private constructor() {
    // Constructor privado para evitar instanciación
  }

  public static checkVictory(data: VictoryCheckerTypes) {
    const { board, player } = data
    const winningCombinations: BOARD_POSITION[][] = [
      [0, 1, 2], // Top row
      [3, 4, 5], // Middle row
      [6, 7, 8], // Bottom row
      [0, 3, 6], // Left column
      [1, 4, 7], // Middle column
      [2, 5, 8], // Right column
      [0, 4, 8], // Diagonal (top-left to bottom-right)
      [2, 4, 6] // Diagonal (top-right to bottom-left)
    ]

    for (const combination of winningCombinations) {
      if (this.isWinningCombination(board, combination, player)) return { player, combination }
    }

    return this.isDraw(board) ? 'DRAW' : null
  }

  private static isWinningCombination(board: (PlayerTurn | '')[], indices: BOARD_POSITION[], player: PlayerTurn) {
    return indices.every((index) => board[index] === player)
  }

  private static isDraw(board: (PlayerTurn | '')[]): boolean {
    return board.every((cell) => cell !== '')
  }
}
