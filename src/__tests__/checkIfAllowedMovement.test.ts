import { describe, it, expect } from 'vitest';
import { checkIfAllowedMovement } from '../utils/checkIfAllowedMovement';
import { COLOUR_BLACK, COLOUR_WHITE, PIECE_BISHOP, PIECE_KING, PIECE_KNIGHT, PIECE_PAWN, PIECE_QUEEN, PIECE_ROOK } from '../constants';
const createEmptyBoard = () => Array(8).fill(null).map(() => Array(8).fill(null));

describe('checkIfAllowedMovement', () => {

    describe('pawn movement', () => {
        it('allows a white pawn to move forward one square', () => {
            const board = createEmptyBoard();
            board[6][4] = { type: PIECE_PAWN, color: COLOUR_WHITE };
            const pieceLocation = { oldRow: 6, oldCol: 4 };

            const isAllowed = checkIfAllowedMovement(board[6][4]!, pieceLocation, 5, 4, board);
            expect(isAllowed).toBe(true);
        });

        it('allows a black pawn to move forward one square', () => {
            const board = createEmptyBoard();
            board[1][4] = { type: PIECE_PAWN, color: COLOUR_BLACK };
            const pieceLocation = { oldRow: 1, oldCol: 4 };

            const isAllowed = checkIfAllowedMovement(board[1][4]!, pieceLocation, 2, 4, board);
            expect(isAllowed).toBe(true);
        });

        it('allows a white pawn to move forward two squares from start', () => {
            const board = createEmptyBoard();
            board[6][4] = { type: PIECE_PAWN, color: COLOUR_WHITE };
            const pieceLocation = { oldRow: 6, oldCol: 4 };

            const isAllowed = checkIfAllowedMovement(board[6][4]!, pieceLocation, 4, 4, board);
            expect(isAllowed).toBe(true);
        });

        it('allows a black pawn to move forward two squares from start', () => {
            const board = createEmptyBoard();
            board[1][4] = { type: PIECE_PAWN, color: COLOUR_BLACK };
            const pieceLocation = { oldRow: 1, oldCol: 4 };

            const isAllowed = checkIfAllowedMovement(board[1][4]!, pieceLocation, 3, 4, board);
            expect(isAllowed).toBe(true);
        });

        it('allows pawn to capture diagonally', () => {
            const board = createEmptyBoard();
            board[6][4] = { type: PIECE_PAWN, color: COLOUR_WHITE };
            board[5][5] = { type: PIECE_PAWN, color: COLOUR_BLACK };
            const pieceLocation = { oldRow: 6, oldCol: 4 };

            const isAllowed = checkIfAllowedMovement(board[6][4]!, pieceLocation, 5, 5, board);
            expect(isAllowed).toBe(true);
        });

        it('blocks pawn movement into occupied square', () => {
            const board = createEmptyBoard();
            board[6][4] = { type: PIECE_PAWN, color: COLOUR_WHITE };
            board[5][4] = { type: PIECE_PAWN, color: COLOUR_BLACK };
            const pieceLocation = { oldRow: 6, oldCol: 4 };

            const isAllowed = checkIfAllowedMovement(board[6][4]!, pieceLocation, 5, 4, board);
            expect(isAllowed).toBe(false);
        });

        it('allows en passant capture', () => {
            const board = createEmptyBoard();
            board[3][4] = { type: PIECE_PAWN, color: COLOUR_WHITE };
            board[3][5] = { type: PIECE_PAWN, color: COLOUR_BLACK };
            const pieceLocation = { oldRow: 3, oldCol: 4 };
            const enPassantTarget = { oldRow: 2, oldCol: 5 };

            const isAllowed = checkIfAllowedMovement(board[3][4]!, pieceLocation, 2, 5, board, false, enPassantTarget);
            expect(isAllowed).toBe(true);
        });

        it('prevents en passant when target is not set', () => {
            const board = createEmptyBoard();
            board[3][4] = { type: PIECE_PAWN, color: COLOUR_WHITE };
            board[3][5] = { type: PIECE_PAWN, color: COLOUR_BLACK };
            const pieceLocation = { oldRow: 3, oldCol: 4 };

            const isAllowed = checkIfAllowedMovement(board[3][4]!, pieceLocation, 2, 5, board, false, null);
            expect(isAllowed).toBe(false);
        });
    });

    describe('knight movement', () => {
        it('allows knight to jump over other pieces', () => {
            const board = createEmptyBoard();
            board[7][1] = { type: PIECE_KNIGHT, color: COLOUR_WHITE };
            board[6][1] = { type: PIECE_PAWN, color: COLOUR_WHITE };
            const pieceLocation = { oldRow: 7, oldCol: 1 };

            const isAllowed = checkIfAllowedMovement(board[7][1]!, pieceLocation, 5, 2, board);
            expect(isAllowed).toBe(true);
        });

        it('blocks knight if move is not L-shaped', () => {
            const board = createEmptyBoard();
            board[7][1] = { type: PIECE_KNIGHT, color: COLOUR_WHITE };
            const pieceLocation = { oldRow: 7, oldCol: 1 };

            const isAllowed = checkIfAllowedMovement(board[7][1]!, pieceLocation, 6, 1, board);
            expect(isAllowed).toBe(false);
        });

        it('allows knight to capture enemy piece', () => {
            const board = createEmptyBoard();
            board[7][1] = { type: PIECE_KNIGHT, color: COLOUR_WHITE };
            board[5][2] = { type: PIECE_PAWN, color: COLOUR_BLACK };
            const pieceLocation = { oldRow: 7, oldCol: 1 };

            const isAllowed = checkIfAllowedMovement(board[7][1]!, pieceLocation, 5, 2, board);
            expect(isAllowed).toBe(true);
        });
    });

    describe('rook movement', () => {
        it('blocks rook if path is obstructed', () => {
            const board = createEmptyBoard();
            board[0][0] = { type: PIECE_ROOK, color: COLOUR_WHITE };
            board[0][3] = { type: PIECE_PAWN, color: COLOUR_WHITE };
            const pieceLocation = { oldRow: 0, oldCol: 0 };

            const isAllowed = checkIfAllowedMovement(board[0][0]!, pieceLocation, 0, 5, board);
            expect(isAllowed).toBe(false);
        });
    });

    describe('bishop movement', () => {
        it('prevents bishop from moving if out of bounds (regression)', () => {
            const board = createEmptyBoard();
            board[0][0] = { type: PIECE_BISHOP, color: COLOUR_WHITE };
            const pieceLocation = { oldRow: 0, oldCol: 0 };

            const isAllowed = checkIfAllowedMovement(board[0][0]!, pieceLocation, -1, -1, board);
            expect(isAllowed).toBe(false);
        });

        it('allows bishop to move diagonally when not blocked', () => {
            const board = createEmptyBoard();
            board[4][4] = { type: PIECE_BISHOP, color: COLOUR_WHITE };
            const pieceLocation = { oldRow: 4, oldCol: 4 };

            const isAllowed = checkIfAllowedMovement(board[4][4]!, pieceLocation, 2, 2, board);
            expect(isAllowed).toBe(true);
        });
    });

    describe('king movement and castling', () => {
        it('prevents king from castling through pieces', () => {
            const board = createEmptyBoard();
            board[7][4] = { type: PIECE_KING, color: COLOUR_WHITE, hasMoved: false };
            board[7][7] = { type: PIECE_ROOK, color: COLOUR_WHITE, hasMoved: false };
            board[7][5] = { type: PIECE_PAWN, color: COLOUR_WHITE };
            const pieceLocation = { oldRow: 7, oldCol: 4 };

            const isAllowed = checkIfAllowedMovement(board[7][4]!, pieceLocation, 7, 6, board);
            expect(isAllowed).toBe(false);
        });

        it('allows castling when path is clear and neither king nor rook has moved', () => {
            const board = createEmptyBoard();
            board[7][4] = { type: PIECE_KING, color: COLOUR_WHITE, hasMoved: false };
            board[7][7] = { type: PIECE_ROOK, color: COLOUR_WHITE, hasMoved: false };
            const pieceLocation = { oldRow: 7, oldCol: 4 };

            const isAllowed = checkIfAllowedMovement(board[7][4]!, pieceLocation, 7, 6, board);
            expect(isAllowed).toBe(true);
        });

        it('allows king to move one square in any direction', () => {
            const board = createEmptyBoard();
            board[4][4] = { type: PIECE_KING, color: COLOUR_WHITE, hasMoved: false };
            const pieceLocation = { oldRow: 4, oldCol: 4 };

            const isAllowed = checkIfAllowedMovement(board[4][4]!, pieceLocation, 5, 5, board);
            expect(isAllowed).toBe(true);
        });

        it('prevents moving a piece if king remains in check after move', () => {
            const board = createEmptyBoard();
            board[0][4] = { type: PIECE_KING, color: COLOUR_WHITE, hasMoved: false };
            board[1][4] = { type: PIECE_PAWN, color: COLOUR_WHITE };
            board[7][4] = { type: PIECE_ROOK, color: COLOUR_BLACK };
            const pieceLocation = { oldRow: 1, oldCol: 4 };

            const isAllowed = checkIfAllowedMovement(board[1][4]!, pieceLocation, 2, 4, board, true);
            expect(isAllowed).toBe(false);
        });

        it('prevents king from moving into check', () => {
            const board = createEmptyBoard();
            board[4][4] = { type: PIECE_KING, color: COLOUR_WHITE };
            board[6][5] = { type: PIECE_ROOK, color: COLOUR_BLACK };
            const pieceLocation = { oldRow: 4, oldCol: 4 };

            const isAllowed = checkIfAllowedMovement(board[4][4]!, pieceLocation, 5, 5, board, true);
            expect(isAllowed).toBe(false);
        });
    });

    describe('queen movement', () => {
        it('allows queen to move diagonally or straight when path is clear', () => {
            const board = createEmptyBoard();
            board[3][3] = { type: PIECE_QUEEN, color: COLOUR_WHITE };
            const pieceLocation = { oldRow: 3, oldCol: 3 };

            const diagonal = checkIfAllowedMovement(board[3][3]!, pieceLocation, 0, 0, board);
            const straight = checkIfAllowedMovement(board[3][3]!, pieceLocation, 3, 7, board);

            expect(diagonal).toBe(true);
            expect(straight).toBe(true);
        });

        it('blocks queen from moving diagonally through pieces', () => {
            const board = createEmptyBoard();
            board[3][3] = { type: PIECE_QUEEN, color: COLOUR_WHITE };
            board[2][2] = { type: PIECE_PAWN, color: COLOUR_WHITE };
            const pieceLocation = { oldRow: 3, oldCol: 3 };

            const isAllowed = checkIfAllowedMovement(board[3][3]!, pieceLocation, 1, 1, board);
            expect(isAllowed).toBe(false);
        });
    });

    describe('general rules', () => {
        it('prevents capturing same color piece', () => {
            const board = createEmptyBoard();
            board[4][4] = { type: PIECE_QUEEN, color: COLOUR_WHITE };
            board[4][6] = { type: PIECE_ROOK, color: COLOUR_WHITE };
            const pieceLocation = { oldRow: 4, oldCol: 4 };

            const isAllowed = checkIfAllowedMovement(board[4][4]!, pieceLocation, 4, 6, board);
            expect(isAllowed).toBe(false);
        });
    });
});
