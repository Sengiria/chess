import { useEffect, useState } from 'react'
import './App.css'
import Board from './components/Board'
import type { Piece, PieceLocation } from './interface'
import { checkIfAllowedMovement, checkIfHasAnyMoves } from './utils/checkIfAllowedMovement'
import { isKingInCheck } from './utils/isKingInCheck'

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
  const [currentPlayer, setCurrentPlayer] = useState("white");
  const [isInCheck, setIsInCheck] = useState<boolean>(false);
  const [isInCheckMate, setIsInCheckMate] = useState<boolean>(false);

  useEffect(() => {
    const inCheck = isKingInCheck(board, currentPlayer);
    const hasAnyMoves = checkIfHasAnyMoves(currentPlayer, board);
    setIsInCheck(inCheck)
    setIsInCheckMate(inCheck && !hasAnyMoves)
    if (inCheck) console.log("You are in Check!")
    if (inCheck && !hasAnyMoves) console.log("You are in Check Mate!")
  }, [board, currentPlayer]);

  const handleMove = (row: number, col: number, piece?: Piece) => {
    if (isInCheckMate) return;
    if (piece?.color !== currentPlayer && !selectedPiece) return;

    if (!selectedPiece && piece?.color === currentPlayer) {
      setSelectedPiece(piece);
      setSelectedPieceLocation({ oldRow: row, oldCol: col });
      return;
    }

    if (!selectedPieceLocation || !selectedPiece) {
      setSelectedPiece(null);
      setSelectedPieceLocation(null);
      return;
    }

    const { oldRow, oldCol } = selectedPieceLocation;

    const isAllowed = checkIfAllowedMovement(
      selectedPiece,
      selectedPieceLocation,
      row,
      col,
      board,
      isInCheck
    );

    if (!isAllowed) {
      setSelectedPiece(null);
      setSelectedPieceLocation(null);
      return;
    }

    const newBoard = board.map(row => [...row]);
    newBoard[row][col] = { ...selectedPiece, hasMoved: true };
    newBoard[oldRow][oldCol] = null;

    if (selectedPiece.type === "king" && Math.abs(col - oldCol) === 2 && row === oldRow) {
      const rookCol = col > oldCol ? 7 : 0;
      const newRookCol = col > oldCol ? col - 1 : col + 1;
      newBoard[row][newRookCol] = { ...board[row][rookCol], hasMoved: true };
      newBoard[row][rookCol] = null;
    }

    const wouldBeInCheck = isKingInCheck(newBoard, currentPlayer);
    if (wouldBeInCheck) {
      setSelectedPiece(null);
      setSelectedPieceLocation(null);
      return;
    }

    setBoard(newBoard);
    setSelectedPiece(null);
    setSelectedPieceLocation(null);
    setCurrentPlayer(prev => (prev === "white" ? "black" : "white"));
  }

  return (
    <>
      <Board matrix={board} handleMove={handleMove} selectedPiece={selectedPiece} selectedPieceLocation={selectedPieceLocation} />
    </>
  )
}

export default App
