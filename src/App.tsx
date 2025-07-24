import { useEffect, useState } from 'react'
import './App.css'
import Board from './components/Board'
import type { CurrentPlayer, GameOverState, Movement, Piece, PieceLocation, PromotionInfo } from './interface'
import { checkIfHasAnyMoves } from './utils/checkIfAllowedMovement'
import { isKingInCheck } from './utils/isKingInCheck'
import { COLOUR_BLACK, COLOUR_WHITE, GAME_STATE_TIE, INITIAL_BOARD } from './constants'
import { movement } from './utils/handleMove'
import { handleStockfishStartup } from './api'
import { hasLocation } from './utils/typeGuards'
import { getBestMoveFromAI } from './utils/getBestAIMove'

const App = () => {
  const [board, setBoard] = useState<(Piece | null)[][]>(INITIAL_BOARD);
  const [selectedPiece, setSelectedPiece] = useState<Piece | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<CurrentPlayer>(COLOUR_WHITE);
  const [pendingPromotion, setPendingPromotion] = useState<PromotionInfo | null>(null);
  const [gameOver, setGameOver] = useState<null | GameOverState>(null);
  const [checkMessageVisible, setCheckMessageVisible] = useState<boolean>(false);
  const [enPassantTarget, setEnPassantTarget] = useState<null | PieceLocation>(null);
  const [playerInCheck, setPlayerInCheck] = useState<null | CurrentPlayer>(null);
  const [lastMove, setLastMove] = useState<Movement | null>(null);

  useEffect(() => {
    handleStockfishStartup().then((ready) => {
      if (ready) {
      } else {
        console.warn("AI ping failed.");
      }
    });
  }, []);

  useEffect(() => {
    if (gameOver) return;
    if (currentPlayer === COLOUR_BLACK) {
      getBestMoveFromAI(board).then((move) => {
        if (move?.piece) {
          movement(
            setLastMove,
            move.to.row,
            move.to.col,
            { ...move.piece, location: move.from },
            setSelectedPiece,
            setCurrentPlayer,
            board,
            false,
            enPassantTarget,
            setEnPassantTarget,
            setPendingPromotion,
            setBoard,
            true
          );
        }
      });
    }

    setSelectedPiece(null);

  }, [currentPlayer]);

  useEffect(() => {
    if (playerInCheck === COLOUR_WHITE) {
      setCheckMessageVisible(true);
      setTimeout(() => {
        setCheckMessageVisible(false);
      }, 2000);
    }
  }, [playerInCheck]);


  useEffect(() => {
    const { inCheck, isCheckmate, isStalemate } = evaluatePlayerState(board, currentPlayer);
    setPlayerInCheck(inCheck ? currentPlayer : null)

    if (isCheckmate) {

      setGameOver({ winner: currentPlayer === COLOUR_WHITE ? COLOUR_BLACK : COLOUR_WHITE });
    } else if (isStalemate) {
      setGameOver({ winner: GAME_STATE_TIE });
    }

  }, [board]);

  const handleMove = (row: number, col: number, piece?: Piece) => {
    if (gameOver || (!selectedPiece && piece?.color !== currentPlayer)) return;

    if (!selectedPiece && piece?.color === currentPlayer) {
      setSelectedPiece({ ...piece, location: { row, col } });
      return;
    }

    if (selectedPiece && hasLocation(selectedPiece)) {
      movement(
        setLastMove,
        row,
        col,
        selectedPiece,
        setSelectedPiece,
        setCurrentPlayer,
        board,
        false,
        enPassantTarget,
        setEnPassantTarget,
        setPendingPromotion,
        setBoard,
      )
    }
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

  const evaluatePlayerState = (board: (Piece | null)[][], player: CurrentPlayer) => {
    const inCheck = isKingInCheck(board, player);
    const hasAnyMoves = checkIfHasAnyMoves(player, board);
    return { inCheck, isCheckmate: inCheck && !hasAnyMoves, isStalemate: !inCheck && !hasAnyMoves };
  };

  return (
    <div className="flex sm:justify-center sm:items-center sm:min-h-screen">
      {checkMessageVisible && (
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-black px-4 py-2 rounded shadow-md text-base sm:text-lg font-bold z-50 animate-bounce">
          You are in Check!
        </div>
      )}
      <Board lastMove={lastMove} matrix={board} handleMove={handleMove} selectedPiece={selectedPiece} pendingPromotion={pendingPromotion} handlePromotion={handlePromotion} gameOver={gameOver} />
    </div>
  )
}

export default App
