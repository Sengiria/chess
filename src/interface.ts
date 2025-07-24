import { COLOUR_WHITE, GAME_STATE_TIE, type COLOUR_BLACK } from "./constants";

export interface PieceLocation {
  row: number,
  col: number,
}
export interface Piece {
  type: string,
  color: string,
  hasMoved?: boolean,
  location?: PieceLocation
}

export interface Movement {
  from: {
    row: number, col: number
  },
  to: {
    row: number,
    col: number
  }
}

export interface PromotionInfo {
  row: number;
  col: number;
  color: Piece["color"];
}

export type CurrentPlayer = typeof COLOUR_BLACK | typeof COLOUR_WHITE;

export type GameOverState = { winner: CurrentPlayer | typeof GAME_STATE_TIE };