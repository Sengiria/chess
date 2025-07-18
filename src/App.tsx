import { useEffect, useState } from 'react'
import './App.css'
import Board from './components/Board'
import type { CurrentPlayer, GameOverState, Piece, PieceLocation, PromotionInfo } from './interface'
import { checkIfHasAnyMoves } from './utils/checkIfAllowedMovement'
import { isKingInCheck } from './utils/isKingInCheck'
import { COLOUR_BLACK, GAME_STATE_TIE, COLOUR_WHITE, INITIAL_BOARD } from './constants'
import { movement } from './utils/handleMove'

const App = () => {
  const [board, setBoard] = useState<(Piece | null)[][]>(INITIAL_BOARD);
  const [selectedPiece, setSelectedPiece] = useState<Piece | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<CurrentPlayer>(COLOUR_WHITE);
  const [isInCheck, setIsInCheck] = useState<boolean>(false);
  const [pendingPromotion, setPendingPromotion] = useState<PromotionInfo | null>(null);
  const [gameOver, setGameOver] = useState<null | GameOverState>(null);
  const [checkMessageVisible, setCheckMessageVisible] = useState<boolean>(false);
  const [enPassantTarget, setEnPassantTarget] = useState<null | PieceLocation>(null);

  useEffect(() => {
    const inCheck = isKingInCheck(board, currentPlayer);
    const hasAnyMoves = checkIfHasAnyMoves(currentPlayer, board);
    setIsInCheck(inCheck)

    if (inCheck) {
      setCheckMessageVisible(true);
      setTimeout(() => setCheckMessageVisible(false), 2000);
    }

    if (inCheck && !hasAnyMoves) {
      setGameOver({ winner: currentPlayer === COLOUR_WHITE ? COLOUR_BLACK : COLOUR_WHITE });
    } else if (!inCheck && !hasAnyMoves) {
      setGameOver({ winner: GAME_STATE_TIE });
    }
  }, [board, currentPlayer]);


  const handleMove = (row: number, col: number, piece?: Piece) => {
    if (gameOver) return;

    if (!selectedPiece && piece?.color === currentPlayer) {
      setSelectedPiece({ ...piece, location: { row, col } });
      return;
    }

    if (!selectedPiece) return;

    movement(
      row,
      col,
      selectedPiece,
      setSelectedPiece,
      currentPlayer,
      setCurrentPlayer,
      board,
      isInCheck,
      enPassantTarget,
      setEnPassantTarget,
      setPendingPromotion,
      setBoard,
    )
  };

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
    <div className="flex sm:justify-center sm:items-center sm:min-h-screen">
      {checkMessageVisible && (
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-black px-4 py-2 rounded shadow-md text-base sm:text-lg font-bold z-50 animate-bounce">
          {currentPlayer.toUpperCase()} is in Check!
        </div>
      )}
      <Board matrix={board} handleMove={handleMove} selectedPiece={selectedPiece} pendingPromotion={pendingPromotion} handlePromotion={handlePromotion} gameOver={gameOver} />
    </div>
  )
}

export default App
