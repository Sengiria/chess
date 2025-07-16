import { useState } from 'react'
import './App.css'
import Board from './components/Board'
import type { Piece, PieceLocation } from './interface'
import { checkIfAllowedMovement } from './utils/checkIfAllowedMovement'

const initialBoard = [
  [{ type: 'rook', color: 'black' }, { type: 'knight', color: 'black' }, { type: 'bishop', color: 'black' }, { type: 'queen', color: 'black' }, { type: 'king', color: 'black' }, { type: 'bishop', color: 'black' }, { type: 'knight', color: 'black' }, { type: 'rook', color: 'black' }],
  Array(8).fill(null).map(() => ({ type: 'pawn', color: 'black' })),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null).map(() => ({ type: 'pawn', color: 'white' })),
  [{ type: 'rook', color: 'white' }, { type: 'knight', color: 'white' }, { type: 'bishop', color: 'white' }, { type: 'queen', color: 'white' }, { type: 'king', color: 'white' }, { type: 'bishop', color: 'white' }, { type: 'knight', color: 'white' }, { type: 'rook', color: 'white' }],
]

const App = () => {
  const [board, setBoard] = useState(initialBoard);
  const [selectedPiece, setSelectedPiece] = useState<Piece | null>(null);
  const [selectedPieceLocation, setSelectedPieceLocation] = useState<PieceLocation | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState("white")

  const handleMove = (row: number, col: number, piece?: Piece) => {
    if (piece?.color !== currentPlayer && !selectedPiece) {
      return;
    }

    if (!selectedPiece && piece?.color === currentPlayer) {
      setSelectedPiece(piece);
      setSelectedPieceLocation({ oldRow: row, oldCol: col })
      return;
    }

    if (!selectedPieceLocation || !selectedPiece) {
      setSelectedPiece(null);
      setSelectedPieceLocation(null);
      return;
    }

    let newBoard = board.map(row => [...row]);
    const { oldRow, oldCol } = selectedPieceLocation;
    const isAllowedMovement = checkIfAllowedMovement(selectedPiece, selectedPieceLocation, row, col, board)

    if (!isAllowedMovement) {
      setSelectedPiece(null);
      setSelectedPieceLocation(null);
      return;
    }

    newBoard[row][col] = { ...selectedPiece, hasMoved: true };
    newBoard[oldRow][oldCol] = null;
    // Special case: Castling
    if (selectedPiece.type === "king" && Math.abs(col - oldCol) === 2 && row === oldRow) {
      const rookCol = col > selectedPieceLocation.oldCol ? 7 : 0;
      const newRookCol = col > selectedPieceLocation.oldCol ? col -1 : col + 1;
      newBoard[row][newRookCol] = {...board[row][rookCol], hasMoved: true}
      newBoard[row][rookCol] = null;
    }
    setBoard(newBoard)
    setSelectedPiece(null)
    setCurrentPlayer(prev => prev === 'white' ? 'black' : 'white');
  }

  return (
    <>
      <Board matrix={board} handleMove={handleMove} />
    </>
  )
}

export default App
