import { describe, it, expect } from 'vitest';
import { checkIfAllowedMovement } from '../utils/checkIfAllowedMovement';
import type { PieceLocation } from '../interface';
const createEmptyBoard = () => Array(8).fill(null).map(() => Array(8).fill(null));

describe('checkIfAllowedMovement', () => {
    it('allows a white pawn to move forward one square', () => {
        const board = createEmptyBoard();
        board[6][4] = { type: 'pawn', color: 'white' };
        const pieceLocation: PieceLocation = { oldRow: 6, oldCol: 4 };

        const isAllowed = checkIfAllowedMovement(board[6][4]!, pieceLocation, 5, 4, board);
        expect(isAllowed).toBe(true);
    });

    it('allows pawn to capture diagonally', () => {
        const board = createEmptyBoard();
        board[6][4] = { type: 'pawn', color: 'white' };
        board[5][5] = { type: 'pawn', color: 'black' };
        const pieceLocation: PieceLocation = { oldRow: 6, oldCol: 4 };

        const isAllowed = checkIfAllowedMovement(board[6][4]!, pieceLocation, 5, 5, board);
        expect(isAllowed).toBe(true);
    });

    it('blocks pawn movement into occupied square', () => {
        const board = createEmptyBoard();
        board[6][4] = { type: 'pawn', color: 'white' };
        board[5][4] = { type: 'pawn', color: 'black' };
        const pieceLocation: PieceLocation = { oldRow: 6, oldCol: 4 };

        const isAllowed = checkIfAllowedMovement(board[6][4]!, pieceLocation, 5, 4, board);
        expect(isAllowed).toBe(false);
    });

    it('allows knight to jump over other pieces', () => {
        const board = createEmptyBoard();
        board[7][1] = { type: 'knight', color: 'white' };
        board[6][1] = { type: 'pawn', color: 'white' };
        const pieceLocation: PieceLocation = { oldRow: 7, oldCol: 1 };

        const isAllowed = checkIfAllowedMovement(board[7][1]!, pieceLocation, 5, 2, board);
        expect(isAllowed).toBe(true);
    });

    it('blocks rook if path is obstructed', () => {
        const board = createEmptyBoard();
        board[0][0] = { type: 'rook', color: 'white' };
        board[0][3] = { type: 'pawn', color: 'white' };
        const pieceLocation: PieceLocation = { oldRow: 0, oldCol: 0 };

        const isAllowed = checkIfAllowedMovement(board[0][0]!, pieceLocation, 0, 5, board);
        expect(isAllowed).toBe(false);
    });

    it('prevents bishop from moving if out of bounds (regression)', () => {
        const board = createEmptyBoard();
        board[0][0] = { type: 'bishop', color: 'white' };
        const pieceLocation: PieceLocation = { oldRow: 0, oldCol: 0 };

        const isAllowed = checkIfAllowedMovement(board[0][0]!, pieceLocation, -1, -1, board);
        expect(isAllowed).toBe(false);
    });

    it('allows bishop to move diagonally when not blocked', () => {
        const board = createEmptyBoard();
        board[4][4] = { type: 'bishop', color: 'white' };
        const pieceLocation: PieceLocation = { oldRow: 4, oldCol: 4 };

        const isAllowed = checkIfAllowedMovement(board[4][4]!, pieceLocation, 2, 2, board);
        expect(isAllowed).toBe(true);
    });

    it('prevents king from castling through pieces', () => {
        const board = createEmptyBoard();
        board[7][4] = { type: 'king', color: 'white', hasMoved: false };
        board[7][7] = { type: 'rook', color: 'white', hasMoved: false };
        board[7][5] = { type: 'pawn', color: 'white' };
        const pieceLocation: PieceLocation = { oldRow: 7, oldCol: 4 };

        const isAllowed = checkIfAllowedMovement(board[7][4]!, pieceLocation, 7, 6, board);
        expect(isAllowed).toBe(false);
    });

    it('allows king to move one square in any direction', () => {
        const board = createEmptyBoard();
        board[4][4] = { type: 'king', color: 'white', hasMoved: false };
        const pieceLocation: PieceLocation = { oldRow: 4, oldCol: 4 };

        const isAllowed = checkIfAllowedMovement(board[4][4]!, pieceLocation, 5, 5, board);
        expect(isAllowed).toBe(true);
    });

    it('prevents moving a piece if king remains in check after move', () => {
  const board = createEmptyBoard();
  board[0][4] = { type: 'king', color: 'white', hasMoved: false };
  board[1][4] = { type: 'pawn', color: 'white' };
  board[7][4] = { type: 'rook', color: 'black' };
  const pieceLocation: PieceLocation = { oldRow: 1, oldCol: 4 };

  const isAllowed = checkIfAllowedMovement(board[1][4]!, pieceLocation, 2, 4, board, true);
  expect(isAllowed).toBe(false);
});

    it('allows queen to move diagonally or straight when path is clear', () => {
        const board = createEmptyBoard();
        board[3][3] = { type: 'queen', color: 'white' };
        const pieceLocation: PieceLocation = { oldRow: 3, oldCol: 3 };

        const diagonal = checkIfAllowedMovement(board[3][3]!, pieceLocation, 0, 0, board);
        const straight = checkIfAllowedMovement(board[3][3]!, pieceLocation, 3, 7, board);

        expect(diagonal).toBe(true);
        expect(straight).toBe(true);
    });
});
