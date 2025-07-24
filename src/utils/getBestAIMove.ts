import { handleStockfishRequest } from "../api";
import type { Piece } from "../interface";
import { generateFEN } from "./generateFENCode";

export const getBestMoveFromAI = async (board: (Piece | null)[][]): Promise<{
  from: { row: number, col: number },
  to: { row: number, col: number },
  piece: Piece | null
} | null> => {
  const fen = generateFEN(board, 'b');
  const bestMove = await handleStockfishRequest(fen);

  if (!bestMove || bestMove.length !== 4) return null;

  const from = bestMove.slice(0, 2);
  const to = bestMove.slice(2, 4);

  const colFrom = from.charCodeAt(0) - 97;
  const rowFrom = 8 - Number(from[1]);

  const colTo = to.charCodeAt(0) - 97;
  const rowTo = 8 - Number(to[1]);

  return {
    from: { row: rowFrom, col: colFrom },
    to: { row: rowTo, col: colTo },
    piece: board[rowFrom][colFrom]
  };
};