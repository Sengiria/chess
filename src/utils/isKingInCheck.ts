
import { PIECE_KING } from "../constants";
import type { Piece, PieceLocation } from "../interface";
import { checkIfAllowedMovement } from "./checkIfAllowedMovement";
import { hasLocation } from "./typeGuards";

export const isKingInCheck = (board: (Piece | null)[][], color: string): boolean => {
    let kingPosition: PieceLocation | null = null;

    for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[row].length; col++) {
            const piece = board[row][col];
            if (piece?.type === PIECE_KING && piece.color === color) {
                kingPosition = { row, col };
                break;
            }
        }
        if (kingPosition) break;
    }

    if (!kingPosition) return true;

    for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[row].length; col++) {
            const piece = board[row][col];
            if (piece && piece.color !== color) {
                const attackingPiece: Piece = {
                    ...piece,
                    location: piece.location || { row, col }
                };
                const canAttack = hasLocation(attackingPiece) && checkIfAllowedMovement(attackingPiece, kingPosition.row, kingPosition.col, board, true);
                if (canAttack) return true;
            }
        }
    }

    return false;
};
