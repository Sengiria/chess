import { describe, it, expect } from 'vitest';
import { checkIfAllowedMovement, checkIfHasAnyMoves } from '../utils/checkIfAllowedMovement';
import { COLOUR_BLACK, COLOUR_WHITE, PIECE_BISHOP, PIECE_KING, PIECE_KNIGHT, PIECE_PAWN, PIECE_QUEEN, PIECE_ROOK } from '../constants';
import type { Piece } from '../interface';
const createEmptyBoard = (): (Piece | null)[][] => Array(8).fill(null).map(() => Array(8).fill(null));

describe('checkIfAllowedMovement', () => {

    describe('pawn movement', () => {
        it('allows a white pawn to move forward one square', () => {
            const board = createEmptyBoard();
            const cell = { type: PIECE_PAWN, color: COLOUR_WHITE };
            board[6][4] = cell;
            const piece = { ...cell, location: { row: 6, col: 4 } };
            const isAllowed = checkIfAllowedMovement(piece, 5, 4, board);
            expect(isAllowed).toBe(true);
        });

        it('allows a black pawn to move forward one square', () => {
            const board = createEmptyBoard();
            const cell = { type: PIECE_PAWN, color: COLOUR_BLACK };
            board[1][4] = cell;
            const piece = { ...cell, location: { row: 1, col: 4 } };
            const isAllowed = checkIfAllowedMovement(piece, 2, 4, board);
            expect(isAllowed).toBe(true);
        });

        it('allows a white pawn to move forward two squares from start', () => {
            const board = createEmptyBoard();
            const cell = { type: PIECE_PAWN, color: COLOUR_WHITE };
            board[6][4] = cell;
            const piece = { ...cell, location: { row: 6, col: 4 } };
            const isAllowed = checkIfAllowedMovement(piece, 4, 4, board);
            expect(isAllowed).toBe(true);
        });

        it('allows a black pawn to move forward two squares from start', () => {
            const board = createEmptyBoard();
            const cell = { type: PIECE_PAWN, color: COLOUR_BLACK };
            board[1][4] = cell;
            const piece = { ...cell, location: { row: 1, col: 4 } };
            const isAllowed = checkIfAllowedMovement(piece, 3, 4, board);
            expect(isAllowed).toBe(true);
        });

        it('allows pawn to capture diagonally', () => {
            const board = createEmptyBoard();
            const whitePawn = { type: PIECE_PAWN, color: COLOUR_WHITE };
            const blackPawn = { type: PIECE_PAWN, color: COLOUR_BLACK };

            board[6][4] = whitePawn;
            board[5][5] = blackPawn;

            const piece = { ...whitePawn, location: { row: 6, col: 4 } };

            const isAllowed = checkIfAllowedMovement(piece, 5, 5, board);
            expect(isAllowed).toBe(true);
        });

        it('blocks pawn movement into occupied square', () => {
            const board = createEmptyBoard();
            const whitePawn = { type: PIECE_PAWN, color: COLOUR_WHITE };
            const blackPawn = { type: PIECE_PAWN, color: COLOUR_BLACK };

            board[6][4] = whitePawn;
            board[5][4] = blackPawn;

            const piece = { ...whitePawn, location: { row: 6, col: 4 } };

            const isAllowed = checkIfAllowedMovement(piece, 5, 4, board);
            expect(isAllowed).toBe(false);
        });

        it('allows en passant capture', () => {
            const board = createEmptyBoard();
            const whitePawn = { type: PIECE_PAWN, color: COLOUR_WHITE };
            const blackPawn = { type: PIECE_PAWN, color: COLOUR_BLACK };

            board[3][4] = whitePawn;
            board[3][5] = blackPawn;

            const piece = { ...whitePawn, location: { row: 3, col: 4 } };
            const enPassantTarget = { row: 2, col: 5 };

            const isAllowed = checkIfAllowedMovement(piece, 2, 5, board, false, enPassantTarget);
            expect(isAllowed).toBe(true);
        });

        it('prevents en passant when target is not set', () => {
            const board = createEmptyBoard();
            const whitePawn = { type: PIECE_PAWN, color: COLOUR_WHITE };
            const blackPawn = { type: PIECE_PAWN, color: COLOUR_BLACK };

            board[3][4] = whitePawn;
            board[3][5] = blackPawn;

            const piece = { ...whitePawn, location: { row: 3, col: 4 } };

            const isAllowed = checkIfAllowedMovement(piece, 2, 5, board, false, null);
            expect(isAllowed).toBe(false);
        });

        it('prevents pawn from moving two steps if it has moved', () => {
            const board = createEmptyBoard();
            board[4][4] = { type: PIECE_PAWN, color: COLOUR_WHITE, hasMoved: true, location: { row: 4, col: 4 } };

            const result = checkIfAllowedMovement(board[4][4], 2, 4, board);

            expect(result).toBe(false);
        });
    });

    describe('knight movement', () => {
        it('allows knight to jump over other pieces', () => {
            const board = createEmptyBoard();
            const knight = { type: PIECE_KNIGHT, color: COLOUR_WHITE };
            const blockingPawn = { type: PIECE_PAWN, color: COLOUR_WHITE };

            board[7][1] = knight;
            board[6][1] = blockingPawn;

            const piece = { ...knight, location: { row: 7, col: 1 } };

            const isAllowed = checkIfAllowedMovement(piece, 5, 2, board);
            expect(isAllowed).toBe(true);
        });

        it('blocks knight if move is not L-shaped', () => {
            const board = createEmptyBoard();
            const knight = { type: PIECE_KNIGHT, color: COLOUR_WHITE };

            board[7][1] = knight;

            const piece = { ...knight, location: { row: 7, col: 1 } };

            const isAllowed = checkIfAllowedMovement(piece, 6, 1, board);
            expect(isAllowed).toBe(false);
        });

        it('allows knight to capture enemy piece', () => {
            const board = createEmptyBoard();
            const knight = { type: PIECE_KNIGHT, color: COLOUR_WHITE };
            const enemyPawn = { type: PIECE_PAWN, color: COLOUR_BLACK };

            board[7][1] = knight;
            board[5][2] = enemyPawn;

            const piece = { ...knight, location: { row: 7, col: 1 } };

            const isAllowed = checkIfAllowedMovement(piece, 5, 2, board);
            expect(isAllowed).toBe(true);
        });
    });

    describe('rook movement', () => {
        it('blocks rook if path is obstructed', () => {
            const board = createEmptyBoard();
            const rook = { type: PIECE_ROOK, color: COLOUR_WHITE };
            const blockingPawn = { type: PIECE_PAWN, color: COLOUR_WHITE };

            board[0][0] = rook;
            board[0][3] = blockingPawn;

            const piece = { ...rook, location: { row: 0, col: 0 } };

            const isAllowed = checkIfAllowedMovement(piece, 0, 5, board);
            expect(isAllowed).toBe(false);
        });
    });

    describe('bishop movement', () => {
        it('prevents bishop from moving if out of bounds (regression)', () => {
            const board = createEmptyBoard();
            const cell = { type: PIECE_BISHOP, color: COLOUR_WHITE };
            board[0][0] = cell;
            const piece = { ...cell, location: { row: 0, col: 0 } };

            const isAllowed = checkIfAllowedMovement(piece, -1, -1, board);
            expect(isAllowed).toBe(false);
        });

        it('allows bishop to move diagonally when not blocked', () => {
            const board = createEmptyBoard();
            const cell = { type: PIECE_BISHOP, color: COLOUR_WHITE };
            board[4][4] = cell;
            const piece = { ...cell, location: { row: 4, col: 4 } };

            const isAllowed = checkIfAllowedMovement(piece, 2, 2, board);
            expect(isAllowed).toBe(true);
        });
    });

    describe('king movement and castling', () => {
        it('prevents king from castling through pieces', () => {
            const board = createEmptyBoard();
            const kingCell = { type: PIECE_KING, color: COLOUR_WHITE, hasMoved: false };
            const rookCell = { type: PIECE_ROOK, color: COLOUR_WHITE, hasMoved: false };
            const pawnCell = { type: PIECE_PAWN, color: COLOUR_WHITE };

            board[7][4] = kingCell;
            board[7][7] = rookCell;
            board[7][5] = pawnCell;

            const piece = { ...kingCell, location: { row: 7, col: 4 } };
            const isAllowed = checkIfAllowedMovement(piece, 7, 6, board);
            expect(isAllowed).toBe(false);
        });

        it('allows castling when path is clear and neither king nor rook has moved', () => {
            const board = createEmptyBoard();
            const kingCell = { type: PIECE_KING, color: COLOUR_WHITE, hasMoved: false };
            const rookCell = { type: PIECE_ROOK, color: COLOUR_WHITE, hasMoved: false };

            board[7][4] = kingCell;
            board[7][7] = rookCell;

            const piece = { ...kingCell, location: { row: 7, col: 4 } };
            const isAllowed = checkIfAllowedMovement(piece, 7, 6, board);
            expect(isAllowed).toBe(true);
        });

        it('allows king to move one square in any direction', () => {
            const board = createEmptyBoard();
            const cell = { type: PIECE_KING, color: COLOUR_WHITE, hasMoved: false };

            board[4][4] = cell;
            const piece = { ...cell, location: { row: 4, col: 4 } };

            const isAllowed = checkIfAllowedMovement(piece, 5, 5, board);
            expect(isAllowed).toBe(true);
        });

        it('prevents moving a piece if king remains in check after move', () => {
            const board = createEmptyBoard();
            const kingCell = { type: PIECE_KING, color: COLOUR_WHITE, hasMoved: false };
            const pawnCell = { type: PIECE_PAWN, color: COLOUR_WHITE };
            const enemyRook = { type: PIECE_ROOK, color: COLOUR_BLACK };

            board[0][4] = kingCell;
            board[1][4] = pawnCell;
            board[7][4] = enemyRook;

            const piece = { ...pawnCell, location: { row: 1, col: 4 } };
            const isAllowed = checkIfAllowedMovement(piece, 2, 4, board, true);
            expect(isAllowed).toBe(false);
        });

        it('prevents king from moving into check', () => {
            const board = createEmptyBoard();
            const kingCell = { type: PIECE_KING, color: COLOUR_WHITE };
            const enemyRook = { type: PIECE_ROOK, color: COLOUR_BLACK };

            board[4][4] = kingCell;
            board[6][5] = enemyRook;

            const piece = { ...kingCell, location: { row: 4, col: 4 } };
            const isAllowed = checkIfAllowedMovement(piece, 5, 5, board, true);
            expect(isAllowed).toBe(false);
        });
    });

    describe('queen movement', () => {
        it('allows queen to move diagonally or straight when path is clear', () => {
            const board = createEmptyBoard();
            const cell = { type: PIECE_QUEEN, color: COLOUR_WHITE };

            board[3][3] = cell;
            const piece = { ...cell, location: { row: 3, col: 3 } };

            const diagonal = checkIfAllowedMovement(piece, 0, 0, board);
            const straight = checkIfAllowedMovement(piece, 3, 7, board);

            expect(diagonal).toBe(true);
            expect(straight).toBe(true);
        });

        it('blocks queen from moving diagonally through pieces', () => {
            const board = createEmptyBoard();
            const cell = { type: PIECE_QUEEN, color: COLOUR_WHITE };
            const blocker = { type: PIECE_PAWN, color: COLOUR_WHITE };

            board[3][3] = cell;
            board[2][2] = blocker;

            const piece = { ...cell, location: { row: 3, col: 3 } };
            const isAllowed = checkIfAllowedMovement(piece, 1, 1, board);

            expect(isAllowed).toBe(false);
        });
    });

    describe('general rules', () => {
        it('prevents capturing same color piece', () => {
            const board = createEmptyBoard();
            const queen = { type: PIECE_QUEEN, color: COLOUR_WHITE };
            const rook = { type: PIECE_ROOK, color: COLOUR_WHITE };

            board[4][4] = queen;
            board[4][6] = rook;

            const piece = { ...queen, location: { row: 4, col: 4 } };
            const isAllowed = checkIfAllowedMovement(piece, 4, 6, board);

            expect(isAllowed).toBe(false);
        });

        it('returns true if a piece has at least one valid move', () => {
            const board = createEmptyBoard();
            board[6][0] = { type: PIECE_PAWN, color: COLOUR_WHITE };

            expect(checkIfHasAnyMoves(COLOUR_WHITE, board)).toBe(true);
        });

        it('returns false if selected piece has no type or color', () => {
            const board = createEmptyBoard();
            const badPiece = { location: { row: 0, col: 0 } };

            const result = checkIfAllowedMovement(badPiece as Piece, 1, 0, board);
            expect(result).toBe(false);
        });

    });

});
