
import type { Piece, PieceLocation } from "../interface";
import { checkIfAllowedMovement } from "./checkIfAllowedMovement";

export const isKingInCheck = ( board: (Piece | null)[][], color: string): boolean => {
    let kingPosition: PieceLocation | null = null;

    // King of the given color
    for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[row].length; col++) {
            const piece = board[row][col];
            if (piece?.type === "king" && piece.color === color) {
                kingPosition = { oldRow: row, oldCol: col };
                break;
            }
        }
        if (kingPosition) break;
    }

    if (!kingPosition) return false;

    for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[row].length; col++) {
            const piece = board[row][col];
            if (piece && piece.color !== color) {
                const enemyPos = { oldRow: row, oldCol: col };
                const canAttack = checkIfAllowedMovement(piece, enemyPos, kingPosition.oldRow, kingPosition.oldCol, board);
                if (canAttack) return true;
            }
        }
    }

    return false;
};
