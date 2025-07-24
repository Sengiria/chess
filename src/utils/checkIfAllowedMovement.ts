import { COLOUR_BLACK, COLOUR_WHITE, PIECE_BISHOP, PIECE_KING, PIECE_KNIGHT, PIECE_PAWN, PIECE_QUEEN, PIECE_ROOK } from "../constants";
import type { Piece, PieceLocation } from "../interface";
import { isKingInCheck } from "./isKingInCheck";

export const checkIfAllowedMovement = (selectedPiece: Piece & { location: PieceLocation }, newRow: number, newCol: number, board: (Piece | null)[][], skipKingSafetyCheck = false, enPassantTarget?: PieceLocation | null): boolean => {
    // Prevent out-of-bounds moves
    if (newRow < 0 || newRow > 7 || newCol < 0 || newCol > 7) return false;

    const { location: { row, col } } = selectedPiece;

    if (newRow === row && newCol === col) {
        return false;
    }

    let isAllowed = false;
    switch (selectedPiece.type) {
        case PIECE_PAWN: {
            isAllowed = checkIfPawnMovementIsAllowed(selectedPiece, newRow, newCol, board, enPassantTarget)
            break;
        }
        case PIECE_KNIGHT: {
            isAllowed = checkIfKnightMovementIsAllowed(selectedPiece, newRow, newCol, board)
            break;
        }
        case PIECE_ROOK: {
            isAllowed = checkIfRookMovementIsAllowed(selectedPiece, newRow, newCol, board)
            break;
        }
        case PIECE_BISHOP: {
            isAllowed = checkIfBishopMovementIsAllowed(selectedPiece, newRow, newCol, board)
            break;
        }
        case PIECE_QUEEN: {
            isAllowed = checkIfBishopMovementIsAllowed(selectedPiece, newRow, newCol, board) || checkIfRookMovementIsAllowed(selectedPiece, newRow, newCol, board)
            break;
        }
        case PIECE_KING: {
            isAllowed = checkIfKingMovementIsAllowed(selectedPiece, newRow, newCol, board)
            break;
        }
        default:
            break;
    }
    // Calculate if the king is in check after the chosen action 
    // Simulate the move
    if (!skipKingSafetyCheck) {
        const simulatedBoard = board.map((r, rIdx) =>
            r.map((cell, cIdx) =>
                cell ? { ...cell, location: { row: rIdx, col: cIdx } } : null
            )
        );
        simulatedBoard[newRow][newCol] = {
            ...selectedPiece,
            location: { row: newRow, col: newCol },
            hasMoved: true,
        };
        simulatedBoard[selectedPiece.location.row][selectedPiece.location.col] = null;

        const wouldBeInCheck = isKingInCheck(simulatedBoard, selectedPiece.color);
        if (wouldBeInCheck) return false;
    }


    return isAllowed;
}

const checkIfPawnMovementIsAllowed = (selectedPiece: Piece, newRow: number, newCol: number, board: (Piece | null)[][], enPassantTarget?: PieceLocation | null): boolean => {
    if (!selectedPiece.location) return false;

    const { location: { row, col }, color } = selectedPiece;
    const isWhite = color === COLOUR_WHITE;
    const direction = isWhite ? -1 : 1;
    const startRow = isWhite ? 6 : 1;
    const enemyColor = isWhite ? COLOUR_BLACK : COLOUR_WHITE;

    // Forward Move
    if (newRow === row + direction && col === newCol && !board[newRow][newCol]) {
        return true;
    }
    // Forward Move 2 steps
    if (row === startRow && newRow === row + direction * 2 && col === newCol && !board[newRow][newCol] && !board[row + direction][newCol]) {
        return true;
    }
    // Diagonal Attack
    if (newRow === row + direction && Math.abs(newCol - col) === 1 && board[newRow][newCol]?.color === enemyColor) {
        return true;
    }
    // En Passant Capture
    if (
        enPassantTarget &&
        newRow === enPassantTarget.row &&
        newCol === enPassantTarget.col &&
        board[row][newCol]?.type === PIECE_PAWN &&
        board[row][newCol]?.color === enemyColor &&
        board[newRow][newCol] === null &&
        Math.abs(newCol - col) === 1 &&
        newRow === row + direction
    ) {
        return true;
    }

    return false;
}

const checkIfKnightMovementIsAllowed = (selectedPiece: Piece, newRow: number, newCol: number, board: (Piece | null)[][]): boolean => {
    if (!selectedPiece.location) return false;

    const { location: { row, col }, color } = selectedPiece;
    const existingAllyUnitOnField = board[newRow][newCol]?.color === color;
    const rowDiff = Math.abs(newRow - row);
    const colDiff = Math.abs(newCol - col);

    if (((rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2)) && !existingAllyUnitOnField) {
        return true;
    }

    return false;
}

const checkIfRookMovementIsAllowed = (selectedPiece: Piece, newRow: number, newCol: number, board: (Piece | null)[][]): boolean => {
    if (!selectedPiece.location) return false;

    const { location: { row, col }, color } = selectedPiece;

    // Vertical Movement
    if (col === newCol && row !== newRow) {
        const step = newRow > row ? 1 : -1;
        for (let r = row + step; r !== newRow; r += step) {
            if (board[r][col]) return false;
        }

    }
    // Horizontal Movement
    else if (row === newRow && col !== newCol) {
        const step = newCol > col ? 1 : -1;
        for (let c = col + step; c !== newCol; c += step) {
            if (board[row][c]) return false;
        }
    }

    else return false;

    // Destination check
    const existingAllyUnitOnField = board[newRow][newCol]?.color === color;

    return !existingAllyUnitOnField;
}

const checkIfBishopMovementIsAllowed = (selectedPiece: Piece, newRow: number, newCol: number, board: (Piece | null)[][]): boolean => {
    if (!selectedPiece.location) return false;

    const { location: { row, col }, color } = selectedPiece;
    const rowDiff = Math.abs(newRow - row);
    const colDiff = Math.abs(newCol - col);
    const horizontalStep = newCol > col ? 1 : -1;
    const verticalStep = newRow > row ? 1 : -1;

    if (rowDiff !== colDiff) {
        return false;
    }

    let r = row + verticalStep;
    let c = col + horizontalStep;

    while (r !== newRow && c !== newCol) {
        if (r < 0 || r > 7 || c < 0 || c > 7 || board[r][c]) return false;
        r += verticalStep;
        c += horizontalStep;
    }

    // check destination
    const target = board[newRow][newCol];

    return !target || target.color !== color;
}

const checkIfKingMovementIsAllowed = (selectedPiece: Piece, newRow: number, newCol: number, board: (Piece | null)[][]): boolean => {
    if (!selectedPiece.location) return false;

    const { location: { row, col }, color, hasMoved } = selectedPiece;
    const rowDiff = Math.abs(newRow - row);
    const colDiff = Math.abs(newCol - col);
    const rookCol = newCol > col ? 7 : 0;
    const rook = board[row][rookCol];
    const isValidRook = rook?.type === PIECE_ROOK && !rook?.hasMoved;

    // 1 move in any direction
    if (rowDiff <= 1 && colDiff <= 1 && (rowDiff !== 0 || colDiff !== 0)) {
        const target = board[newRow][newCol];
        return !target || target.color !== color;
    }
    // castling
    if (!hasMoved && isValidRook && colDiff === 2 && newRow === row) {
        const step = newCol > col ? 1 : -1;
        for (let c = col + step; c !== rookCol; c += step) {
            if (board[row][c]) return false;
        }
        return true;
    }

    return false;
}

export const checkIfHasAnyMoves = (color: string, board: (Piece | null)[][]): boolean => {
    for (let r = 0; r < board.length; r++) {
        for (let c = 0; c < board[r].length; c++) {
            const piece = board[r][c];
            if (piece?.color === color) {
                const selectedPiece = { ...piece, location: { row: r, col: c } };
                for (let targetR = 0; targetR < board.length; targetR++) {
                    for (let targetC = 0; targetC < board[targetR].length; targetC++) {
                        const isValid = checkIfAllowedMovement(selectedPiece, targetR, targetC, board)
                        if (isValid) return true;
                    }

                }
            }
        }

    }

    return false;
}