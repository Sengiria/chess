import type React from "react";
import { getPieceIcon } from "../utils/getPieceIcon";
import type { Piece, PieceLocation } from "../interface";

interface BoardProps {
    matrix: (Piece | null)[][];
    handleMove: (row: number, col: number, piece?: Piece) => void;
    selectedPiece: Piece | null;
    selectedPieceLocation: PieceLocation | null;
}

const Board: React.FC<BoardProps> = ({ matrix, handleMove, selectedPiece, selectedPieceLocation }) => {
    const files = ["A", "B", "C", "D", "E", "F", "G", "H"];
    const ranks = [8, 7, 6, 5, 4, 3, 2, 1];

    return (
        <div className="w-full h-full flex items-center justify-center p-8">
            <div className="relative bg-[#996140] shadow-lg p-4">
                <div className="flex justify-between w-[400px] h-[20px] text-white font-bold text-sm mx-auto mb-1">
                    {files.map((f) => (
                        <span key={`top-${f}`} className="w-[50px] text-center">
                            {f}
                        </span>
                    ))}
                </div>

                <div className="flex">
                    <div className="flex flex-col justify-between mr-1 text-white font-bold text-sm h-[400px]">
                        {ranks.map((r) => (
                            <span
                                key={`left-${r}`}
                                className="h-[50px] w-[20px] flex items-center justify-center"
                            >
                                {r}
                            </span>
                        ))}
                    </div>
                    <div className="grid grid-cols-8 grid-rows-8 gap-2 w-[400px] h-[400px]">
                        {matrix.map((row, rowIndex) =>
                            row.map((cell, colIndex) => {
                                const isLight = (rowIndex + colIndex) % 2 === 0;
                                const squareColor = isLight ? "bg-[#e7d5c0]" : "bg-[#ae8167]";
                                const icon = cell ? getPieceIcon(cell) : null;
                                const isSelected = selectedPieceLocation &&
                                selectedPieceLocation.oldRow === rowIndex &&
                                selectedPieceLocation.oldCol === colIndex;

                                return (
                                    <button
                                        key={`${rowIndex}-${colIndex}`}
                                        onClick={() => handleMove(rowIndex, colIndex, cell ?? undefined)}
                                        className={`w-[50px] h-[50px] flex items-center justify-center ${squareColor} 
                                        cursor-pointer transition-all duration-200 
                                        hover:ring-2 hover:ring-yellow-500 hover:z-40
                                        ${isSelected ? "ring-2 ring-yellow-500 z-40": ""}
                                    `}
                                    >
                                        {icon && (
                                            <span
                                                className={`text-2xl ${cell?.color === "white" ? "text-white" : "text-black"} drop-shadow-sm`}
                                            >
                                                {icon}
                                            </span>
                                        )}
                                    </button>
                                );
                            })
                        )}
                    </div>
                    <div className="flex flex-col justify-between ml-1 text-white font-bold text-sm h-[400px]">
                        {ranks.map((r) => (
                            <span
                                key={`right-${r}`}
                                className="h-[50px] w-[20px] flex items-center justify-center"
                            >
                                {r}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="flex justify-between w-[400px] h-[20px] text-white font-bold text-sm mx-auto mt-1">
                    {files.map((f) => (
                        <span key={`bot-${f}`} className="w-[50px] text-center">
                            {f}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Board;
