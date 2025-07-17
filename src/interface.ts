export interface Piece {
    type: string,
    color: string,
    hasMoved?: boolean,
}
export interface PieceLocation {
    oldRow: number,
    oldCol: number,
}

export interface PromotionInfo {
  row: number;
  col: number;
  color: Piece["color"];
}