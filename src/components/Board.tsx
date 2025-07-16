import type React from "react"
import { getPieceIcon } from "../utils/getPieceIcon"
import type { Piece } from "../interface"

interface BoardProps {
    matrix: (Piece | null)[][],
    handleMove: (row: number, col: number, piece?: Piece,) => void,
}

const Board: React.FC<BoardProps> = ({ matrix, handleMove }) => {
    return (
        <div className="grid grid-cols-8 w-fit border border-black">
            {
                matrix.map((row, rowIndex) =>
                    row.map((cell, colIndex) => (
                        <div
                            onClick={() => handleMove(rowIndex, colIndex, cell ?? undefined)}
                            key={`${rowIndex}-${colIndex}`}
                            className={`w-16 h-16 flex items-center justify-center border border-gray-400 text-2xl select-none transition hover:cursor-pointer hover:scale-105 ${(rowIndex + colIndex) % 2 === 0 ? "bg-white" : "bg-gray-800"}`}
                        >
                            {cell ? getPieceIcon(cell) : null}
                        </div>
                    ))
                )
            }

        </div>
    )
}

export default Board;