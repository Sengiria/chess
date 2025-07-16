export interface Piece {
    type: string,
    color: string,
    hasMoved?: boolean,
}
export interface PieceLocation {
    oldRow: number,
    oldCol: number,
}