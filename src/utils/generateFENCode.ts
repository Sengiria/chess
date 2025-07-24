import { COLOUR_WHITE } from '../constants';
import type { Piece } from '../interface';

export const generateFEN = (
  board: (Piece | null)[][],
  currentPlayer: 'w' | 'b' = 'w'
): string => {
  const rows = board.map((row) => {
    let fenRow = '';
    let emptyCount = 0;

    for (const piece of row) {
      if (!piece) {
        emptyCount++;
      } else {
        if (emptyCount > 0) {
          fenRow += emptyCount;
          emptyCount = 0;
        }
        const charMap: Record<string, string> = {
          pawn: 'p',
          knight: 'n',
          bishop: 'b',
          rook: 'r',
          queen: 'q',
          king: 'k',
        };
        const pieceChar = charMap[piece.type];
        fenRow += piece.color === COLOUR_WHITE ? pieceChar.toUpperCase() : pieceChar;
      }
    }

    if (emptyCount > 0) fenRow += emptyCount;
    return fenRow;
  });

  const boardPart = rows.join('/');
  return `${boardPart} ${currentPlayer} - - 0 1`;
};
