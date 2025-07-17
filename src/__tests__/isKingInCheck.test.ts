import { describe, it, expect } from 'vitest';
import type { Piece } from '../interface';
import { isKingInCheck } from '../utils/isKingInCheck';

const createEmptyBoard = (): (Piece | null)[][] => Array(8).fill(null).map(() => Array(8).fill(null));

describe('isKingInCheck', () => {
  it('returns false when king is safe', () => {
    const board = createEmptyBoard();
    board[0][4] = { type: 'king', color: 'white' };
    board[7][4] = { type: 'king', color: 'black' };
    expect(isKingInCheck(board, 'white')).toBe(false);
  });

  it('detects vertical check from rook', () => {
    const board = createEmptyBoard();
    board[0][4] = { type: 'king', color: 'white' };
    board[7][4] = { type: 'rook', color: 'black' };
    expect(isKingInCheck(board, 'white')).toBe(true);
  });

  it('detects diagonal check from bishop', () => {
    const board = createEmptyBoard();
    board[4][4] = { type: 'king', color: 'white' };
    board[1][1] = { type: 'bishop', color: 'black' };
    expect(isKingInCheck(board, 'white')).toBe(true);
  });

  it('returns false if enemy piece is blocked', () => {
    const board = createEmptyBoard();
    board[4][4] = { type: 'king', color: 'white' };
    board[1][1] = { type: 'bishop', color: 'black' };
    board[2][2] = { type: 'pawn', color: 'black' };
    expect(isKingInCheck(board, 'white')).toBe(false);
  });

  it('detects knight check', () => {
    const board = createEmptyBoard();
    board[4][4] = { type: 'king', color: 'white' };
    board[2][5] = { type: 'knight', color: 'black' };
    expect(isKingInCheck(board, 'white')).toBe(true);
  });

  it('returns false if king not found', () => {
    const board = createEmptyBoard();
    expect(isKingInCheck(board, 'white')).toBe(false);
  });
});
