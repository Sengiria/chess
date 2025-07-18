import { describe, it, expect } from 'vitest';

import { isKingInCheck } from '../utils/isKingInCheck';
import { COLOUR_BLACK, COLOUR_WHITE, PIECE_BISHOP, PIECE_KING, PIECE_KNIGHT, PIECE_PAWN, PIECE_ROOK } from '../constants';
import type { Piece } from '../interface';

const createEmptyBoard = (): (Piece | null)[][] => Array(8).fill(null).map(() => Array(8).fill(null));

describe('isKingInCheck', () => {
  it('returns false when king is safe', () => {
    const board = createEmptyBoard();
    const whiteKing = { type: PIECE_KING, color: COLOUR_WHITE };
    const blackKing = { type: PIECE_KING, color: COLOUR_BLACK };

    board[0][4] = whiteKing;
    board[7][4] = blackKing;

    expect(isKingInCheck(board, COLOUR_WHITE)).toBe(false);
  });

  it('detects vertical check from rook', () => {
    const board = createEmptyBoard();
    const whiteKing = { type: PIECE_KING, color: COLOUR_WHITE };
    const blackRook = { type: PIECE_ROOK, color: COLOUR_BLACK };

    board[0][4] = whiteKing;
    board[7][4] = blackRook;

    expect(isKingInCheck(board, COLOUR_WHITE)).toBe(true);
  });

  it('detects diagonal check from bishop', () => {
    const board = createEmptyBoard();
    const whiteKing = { type: PIECE_KING, color: COLOUR_WHITE };
    const blackBishop = { type: PIECE_BISHOP, color: COLOUR_BLACK };

    board[4][4] = whiteKing;
    board[1][1] = blackBishop;

    expect(isKingInCheck(board, COLOUR_WHITE)).toBe(true);
  });

  it('returns false if enemy piece is blocked', () => {
    const board = createEmptyBoard();
    const whiteKing = { type: PIECE_KING, color: COLOUR_WHITE };
    const blackBishop = { type: PIECE_BISHOP, color: COLOUR_BLACK };
    const blackPawn = { type: PIECE_PAWN, color: COLOUR_BLACK };

    board[4][4] = whiteKing;
    board[1][1] = blackBishop;
    board[2][2] = blackPawn;

    expect(isKingInCheck(board, COLOUR_WHITE)).toBe(false);
  });

  it('detects knight check', () => {
    const board = createEmptyBoard();
    const whiteKing = { type: PIECE_KING, color: COLOUR_WHITE };
    const blackKnight = { type: PIECE_KNIGHT, color: COLOUR_BLACK };

    board[4][4] = whiteKing;
    board[2][5] = blackKnight;

    expect(isKingInCheck(board, COLOUR_WHITE)).toBe(true);
  });

  it('returns false if king not found', () => {
    const board = createEmptyBoard();
    expect(isKingInCheck(board, COLOUR_WHITE)).toBe(false);
  });
});
