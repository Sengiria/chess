import { COLOUR_BLACK, COLOUR_WHITE, PIECE_KING, PIECE_PAWN, PIECE_QUEEN } from "../constants";
import type { CurrentPlayer, Piece, PieceLocation, PromotionInfo } from "../interface";
import { checkIfAllowedMovement } from "./checkIfAllowedMovement";

export const movement = (
    newRow: number,
    newCol: number,
    selectedPiece: Piece & { location: PieceLocation },
    setSelectedPiece: React.Dispatch<React.SetStateAction<Piece | null>>,
    setCurrentPlayer: React.Dispatch<React.SetStateAction<CurrentPlayer>>,
    board: (Piece | null)[][],
    isInCheck: boolean,
    enPassantTarget: PieceLocation | null,
    setEnPassantTarget: React.Dispatch<React.SetStateAction<PieceLocation | null>>,
    setPendingPromotion: React.Dispatch<React.SetStateAction<PromotionInfo | null>>,
    setBoard: React.Dispatch<React.SetStateAction<(Piece | null)[][]>>,
    isAIMove: boolean = false
) => {

    const resetSelection = () => {
        setSelectedPiece(null);
    };

    const { row, col } = selectedPiece.location;

    const isMovementAllowed = isAIMove || checkIfAllowedMovement(
        selectedPiece,
        newRow,
        newCol,
        board,
        isInCheck,
        enPassantTarget,
    );

    if (!isMovementAllowed) {
        resetSelection()
        return;
    }

    const newBoard = board.map(row => [...row]);
    newBoard[newRow][newCol] = { ...selectedPiece, location: { row: newRow, col: newCol }, hasMoved: true };
    newBoard[row][col] = null;

    if (selectedPiece.type === PIECE_KING && Math.abs(newCol - col) === 2 && newRow === row) {
        const rookCol = newCol > col ? 7 : 0;
        const newRookCol = newCol > col ? newCol - 1 : newCol + 1;
        newBoard[row][newRookCol] = { ...(board[row][rookCol] as Piece), hasMoved: true };
        newBoard[row][rookCol] = null;
    }

    if (selectedPiece.type === PIECE_PAWN && Math.abs(newRow - row) === 2) {
        setEnPassantTarget({
            row: (newRow + row) / 2,
            col,
        });
    } else {
        setEnPassantTarget(null);
    }

if (selectedPiece.type === PIECE_PAWN && ((selectedPiece.color === COLOUR_WHITE && newRow === 0) || (selectedPiece.color === COLOUR_BLACK && newRow === 7))) {
  if (isAIMove) {
    newBoard[newRow][newCol] = {
      type: PIECE_QUEEN,
      color: selectedPiece.color,
      hasMoved: true,
      location: {
        row: newRow,
        col: newCol,
      },
    };
    newBoard[row][col] = null;
    setBoard(newBoard);
    setCurrentPlayer(prev => (prev === COLOUR_WHITE ? COLOUR_BLACK : COLOUR_WHITE));
  } else {
    setPendingPromotion({ row: newRow, col: newCol, color: selectedPiece.color });
    newBoard[row][col] = null;
    setBoard(newBoard);
    resetSelection();
  }
  return;
}
    if (selectedPiece.type === PIECE_PAWN && enPassantTarget && newRow === enPassantTarget.row && newCol === enPassantTarget.col && board[row][newCol]?.type === PIECE_PAWN) {
        newBoard[row][newCol] = null;
        setEnPassantTarget(null);
    }

    setBoard(newBoard);
    setSelectedPiece(null);
    setCurrentPlayer(prev => (prev === COLOUR_WHITE ? COLOUR_BLACK : COLOUR_WHITE));
}
