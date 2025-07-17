import { useEffect, useState } from 'react'
import './App.css'
import Board from './components/Board'
import type { Piece, PieceLocation, PromotionInfo } from './interface'
import { checkIfAllowedMovement, checkIfHasAnyMoves } from './utils/checkIfAllowedMovement'
import { isKingInCheck } from './utils/isKingInCheck'
import { COLOUR_BLACK, GAME_STATE_TIE, COLOUR_WHITE, INITIAL_BOARD, PIECE_KING, PIECE_PAWN, } from './constants'

const App = () => {
  const [board, setBoard] = useState(INITIAL_BOARD);
  const [selectedPiece, setSelectedPiece] = useState<Piece | null>(null);
  const [selectedPieceLocation, setSelectedPieceLocation] = useState<PieceLocation | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState(COLOUR_WHITE);
  const [isInCheck, setIsInCheck] = useState<boolean>(false);
  const [pendingPromotion, setPendingPromotion] = useState<PromotionInfo | null>(null);
  const [gameOver, setGameOver] = useState<null | { winner: typeof COLOUR_WHITE | typeof COLOUR_BLACK | typeof GAME_STATE_TIE }>(null);

  useEffect(() => {
    const inCheck = isKingInCheck(board, currentPlayer);
    const hasAnyMoves = checkIfHasAnyMoves(currentPlayer, board);
    setIsInCheck(inCheck)

    if (inCheck && !hasAnyMoves) {
      setGameOver({ winner: currentPlayer === COLOUR_WHITE ? COLOUR_BLACK : COLOUR_WHITE });
    } else if (!inCheck && !hasAnyMoves) {
      setGameOver({ winner: GAME_STATE_TIE });
    }
  }, [board, currentPlayer]);

  const handleMove = (row: number, col: number, piece?: Piece) => {
    if (gameOver) return;
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

    if (selectedPiece.type === PIECE_KING && Math.abs(col - oldCol) === 2 && row === oldRow) {
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

    if (
      selectedPiece.type === PIECE_PAWN &&
      ((selectedPiece.color === COLOUR_WHITE && row === 0) ||
        (selectedPiece.color === COLOUR_BLACK && row === 7))
    ) {
      setPendingPromotion({ row, col, color: selectedPiece.color });
      newBoard[oldRow][oldCol] = null;
      setBoard(newBoard);
      setSelectedPiece(null);
      setSelectedPieceLocation(null);
      return;
    }

    setBoard(newBoard);
    setSelectedPiece(null);
    setSelectedPieceLocation(null);
    setCurrentPlayer(prev => (prev === COLOUR_WHITE ? COLOUR_BLACK : COLOUR_WHITE));

  }

  const handlePromotion = (pieceType: Piece["type"]) => {
    if (!pendingPromotion) return;

    const { row, col, color } = pendingPromotion;
    const newBoard = board.map((r) => [...r]);
    newBoard[row][col] = {
      type: pieceType,
      color,
      hasMoved: true,
    };

    setBoard(newBoard);
    setPendingPromotion(null);
    setCurrentPlayer((prev) => (prev === COLOUR_WHITE ? COLOUR_BLACK : COLOUR_WHITE));
  };

  return (
    <>
      <Board matrix={board} handleMove={handleMove} selectedPieceLocation={selectedPieceLocation} pendingPromotion={pendingPromotion} handlePromotion={handlePromotion} gameOver={gameOver} />
    </>
  )
}

export default App
