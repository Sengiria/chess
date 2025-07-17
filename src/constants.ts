export const PIECE_ROOK = 'rook';
export const PIECE_KNIGHT = 'knight';
export const PIECE_BISHOP = 'bishop';
export const PIECE_QUEEN = 'queen';
export const PIECE_KING = 'king';
export const PIECE_PAWN = 'pawn';

export const COLOUR_WHITE = "white";
export const COLOUR_BLACK = "black";
export const GAME_STATE_TIE = "tie";

export const FILES = ["A", "B", "C", "D", "E", "F", "G", "H"];
export const RANKS = [8, 7, 6, 5, 4, 3, 2, 1];

export const INITIAL_BOARD = [
  [{ type: PIECE_ROOK, color: COLOUR_BLACK }, { type: PIECE_KNIGHT, color: COLOUR_BLACK }, { type: PIECE_BISHOP, color: COLOUR_BLACK }, { type: PIECE_QUEEN, color: COLOUR_BLACK }, { type: PIECE_KING, color: COLOUR_BLACK }, { type: PIECE_BISHOP, color: COLOUR_BLACK }, { type: PIECE_KNIGHT, color: COLOUR_BLACK }, { type: PIECE_ROOK, color: COLOUR_BLACK }],
  Array(8).fill(null).map(() => ({ type: PIECE_PAWN, color: COLOUR_BLACK })),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null).map(() => ({ type: PIECE_PAWN, color: COLOUR_WHITE })),
  [{ type: PIECE_ROOK, color: COLOUR_WHITE }, { type: PIECE_KNIGHT, color: COLOUR_WHITE }, { type: PIECE_BISHOP, color: COLOUR_WHITE }, { type: PIECE_QUEEN, color: COLOUR_WHITE }, { type: PIECE_KING, color: COLOUR_WHITE }, { type: PIECE_BISHOP, color: COLOUR_WHITE }, { type: PIECE_KNIGHT, color: COLOUR_WHITE }, { type: PIECE_ROOK, color: COLOUR_WHITE }],
]