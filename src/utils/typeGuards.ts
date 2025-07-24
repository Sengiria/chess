import type { Piece, PieceLocation } from "../interface";

export const hasLocation = (piece: Piece): piece is Piece & { location: PieceLocation } => {
  return piece.location !== undefined;
};