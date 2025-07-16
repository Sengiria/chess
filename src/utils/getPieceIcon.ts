export const getPieceIcon = (piece: { type: string, color: string }) => {
  const icons: Record<string, string> = {
    'pawn-white': '♙',
    'rook-white': '♖',
    'knight-white': '♘',
    'bishop-white': '♗',
    'queen-white': '♕',
    'king-white': '♔',
    'pawn-black': '♟︎',
    'rook-black': '♜',
    'knight-black': '♞',
    'bishop-black': '♝',
    'queen-black': '♛',
    'king-black': '♚',
  };
  return icons[`${piece.type}-${piece.color}`];
};
