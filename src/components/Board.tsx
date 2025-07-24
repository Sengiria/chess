import type React from "react";
import { getPieceIcon } from "../utils/getPieceIcon";
import type { Piece, PromotionInfo } from "../interface";
import { COLOUR_BLACK, COLOUR_WHITE, FILES, GAME_STATE_TIE, RANKS } from "../constants";

interface BoardProps {
    matrix: (Piece | null)[][];
    handleMove: (row: number, col: number, piece?: Piece) => void;
    selectedPiece: Piece | null;
    pendingPromotion: PromotionInfo | null
    handlePromotion: (pieceType: Piece["type"]) => void;
    gameOver: null | { winner: typeof COLOUR_WHITE | typeof COLOUR_BLACK | typeof GAME_STATE_TIE };
    lastMove: { from: { row: number; col: number }; to: { row: number; col: number } } | null;
}

const Board: React.FC<BoardProps> = ({ matrix, handleMove, selectedPiece, pendingPromotion, handlePromotion, gameOver, lastMove }) => {
    return (
        <div className="w-full max-w-[500px] aspect-square sm:aspect-auto bg-[#996140]">
            <div className="flex justify-between text-white font-bold text-xs mb-1 px-[28px]">
                {FILES.map((f) => (
                    <span key={`top-${f}`} className="w-[calc(100%/10)] text-center">
                        {f}
                    </span>
                ))}
            </div>

            <div className="relative">
                <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-white font-bold text-xs pl-1 z-10">
                    {RANKS.map((r) => (
                        <span key={`left-${r}`} className="h-[calc(100%/8)] flex items-center">
                            {r}
                        </span>
                    ))}
                </div>

                <div className="absolute right-0 top-0 bottom-0 flex flex-col justify-between text-white font-bold text-xs pr-1 z-10">
                    {RANKS.map((r) => (
                        <span key={`right-${r}`} className="h-[calc(100%/8)] flex items-center">
                            {r}
                        </span>
                    ))}
                </div>

                <div className="aspect-square bg-[#996140] relative z-0 mx-[20px]">
                    <div className="grid grid-cols-8 grid-rows-8 w-full h-full gap-[2px]">
                        {matrix.map((row, rowIndex) =>
                            row.map((cell, colIndex) => {
                                const isLight = (rowIndex + colIndex) % 2 === 0;
                                const squareColor = isLight ? "bg-[#e7d5c0]" : "bg-[#ae8167]";
                                const icon = cell ? getPieceIcon(cell) : null;
                                const isSelected =
                                    selectedPiece?.location &&
                                    selectedPiece.location.row === rowIndex &&
                                    selectedPiece.location.col === colIndex;
                                const isLastMoveFrom =
                                    lastMove?.from.row === rowIndex && lastMove?.from.col === colIndex;

                                const isLastMoveTo =
                                    lastMove?.to.row === rowIndex && lastMove?.to.col === colIndex;

                                const highlightRing = isSelected
                                    ? "ring-2 ring-yellow-500 z-40"
                                    : isLastMoveFrom
                                        ? "ring-2 ring-green-500 z-30 "
                                        : isLastMoveTo
                                            ? "ring-2 ring-green-300 z-30 animate-pulse "
                                            : "";

                                return (
                                    <button
                                        key={`${rowIndex}-${colIndex}`}
                                        onClick={() => handleMove(rowIndex, colIndex, cell ?? undefined)}
                                        className={`w-full h-full flex items-center justify-center ${squareColor} 
                  cursor-pointer transition-all duration-200 
                  hover:ring-2 hover:ring-yellow-500 hover:z-40
                  ${highlightRing}
                  ${isSelected ? "ring-2 ring-yellow-500 z-40" : ""}
              `}
                                    >
                                        {icon && (
                                            <span
                                                className={`text-2xl ${cell?.color === "white" ? "text-white" : "text-black"
                                                    } drop-shadow-sm`}
                                            >
                                                {icon}
                                            </span>
                                        )}
                                    </button>
                                );
                            })
                        )}
                    </div>

                    {pendingPromotion && (
                        <div className="absolute inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                            <div className="bg-white rounded shadow-lg p-4 text-center">
                                <p className="mb-2 font-bold text-black">Choose a piece to promote to:</p>
                                <div className="flex justify-center gap-4">
                                    {["queen", "rook", "bishop", "knight"].map((type) => (
                                        <button
                                            key={type}
                                            onClick={() => handlePromotion(type)}
                                            className="text-3xl hover:scale-110 transition-transform"
                                        >
                                            {getPieceIcon({ type: type as Piece["type"], color: pendingPromotion.color })}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {gameOver && (
                        <div className="absolute inset-0 flex items-center justify-center z-40">
                            <div className="bg-[#e7d5c0] border-4 border-[#ae8167] p-6 rounded shadow-xl text-center pointer-events-auto">
                                <h2 className="text-2xl font-bold mb-2">
                                    {gameOver.winner === "tie" ? "Stalemate!" : `${gameOver.winner.toUpperCase()} wins!`}
                                </h2>
                                <button
                                    onClick={() => window.location.reload()}
                                    className="mt-4 px-4 py-2 bg-[#996140] text-white rounded hover:bg-[#7e4f2f] hover:cursor-pointer"
                                >
                                    Play Again
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex justify-between text-white font-bold text-xs mt-1 px-[28px]">
                {FILES.map((f) => (
                    <span key={`bot-${f}`} className="w-[calc(100%/10)] text-center">
                        {f}
                    </span>
                ))}
            </div>
        </div>

    );
};

export default Board;
