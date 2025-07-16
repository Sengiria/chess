import type { Piece, PieceLocation } from "../interface";

export const checkIfAllowedMovement = (selectedPiece: Piece, selectedPieceLocation: PieceLocation, newRow: number, newCol: number, board: (Piece | null)[][]): boolean => {
    let isAllowed = false;
    switch (selectedPiece.type) {
        case "pawn": {
            isAllowed = checkIfPawnMovementIsAllowed(selectedPiece.color, selectedPieceLocation, newRow, newCol, board)
            break;
        }
        case "knight": {
            isAllowed = checkIfKnightMovementIsAllowed(selectedPiece.color, selectedPieceLocation, newRow, newCol, board)
            break;
        }
        case "rook": {
            isAllowed = checkIfRookMovementIsAllowed(selectedPiece.color, selectedPieceLocation, newRow, newCol, board)
            break;
        }
        case "bishop": {
            isAllowed = checkIfBishopMovementIsAllowed(selectedPiece.color, selectedPieceLocation, newRow, newCol, board)
            break;
        }
        case "queen": {
            isAllowed = checkIfBishopMovementIsAllowed(selectedPiece.color, selectedPieceLocation, newRow, newCol, board) || checkIfRookMovementIsAllowed(selectedPiece.color, selectedPieceLocation, newRow, newCol, board)
            break;
        }
        case "king": {
            isAllowed = checkIfKingMovementIsAllowed(selectedPiece, selectedPieceLocation, newRow, newCol, board)
            break;
        }
        default:
            break;
    }

    return isAllowed;
}


const checkIfPawnMovementIsAllowed = (color: string, selectedPieceLocation: PieceLocation, newRow: number, newCol: number, board: (Piece | null)[][]): boolean => {
    const { oldRow, oldCol } = selectedPieceLocation;
    const isWhite = color === "white";
    const direction = isWhite ? -1 : 1;
    const startRow = isWhite ? 6 : 1;
    const enemyColor = isWhite ? "black" : "white";

    // Forward Move
    if (newRow === oldRow + direction && oldCol === newCol && !board[newRow][newCol]) {
        return true;
    }
    // Forward Move 2 steps
    if (oldRow === startRow && newRow === oldRow + direction * 2 && oldCol === newCol && !board[newRow][newCol] && !board[oldRow + direction][newCol]) {
        return true;
    }
    // Diagonal Attack
    if (newRow === oldRow + direction && Math.abs(newCol - oldCol) === 1 && board[newRow][newCol]?.color === enemyColor) {
        return true;
    }

    return false;
}

const checkIfKnightMovementIsAllowed = (color: string, selectedPieceLocation: PieceLocation, newRow: number, newCol: number, board: (Piece | null)[][]): boolean => {
    const { oldRow, oldCol } = selectedPieceLocation;
    const existingAllyUnitOnField = board[newRow][newCol]?.color === color;
    const rowDiff = Math.abs(newRow - oldRow);
    const colDiff = Math.abs(newCol - oldCol);

    if (((rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2)) && !existingAllyUnitOnField) {
        return true;
    }

    return false;
}

const checkIfRookMovementIsAllowed = (color: string, selectedPieceLocation: PieceLocation, newRow: number, newCol: number, board: (Piece | null)[][]): boolean => {
    const { oldRow, oldCol } = selectedPieceLocation;

    // Vertical Movement
    if (oldCol === newCol && oldRow !== newRow) {
        const step = newRow > oldRow ? 1 : -1;
        for (let r = oldRow + step; r !== newRow; r += step) {
            if (board[r][oldCol]) return false;
        }

    }
    // Horizontal Movement
    else if (oldRow === newRow && oldCol !== newCol) {
        const step = newCol > oldCol ? 1 : -1;
        for (let c = oldCol + step; c !== newCol; c += step) {
            if (board[oldRow][c]) return false;
        }
    }

    else return false;

    // Destination check
    const existingAllyUnitOnField = board[newRow][newCol]?.color === color;

    return !existingAllyUnitOnField;
}

const checkIfBishopMovementIsAllowed = (color: string, selectedPieceLocation: PieceLocation, newRow: number, newCol: number, board: (Piece | null)[][]): boolean => {
    const { oldCol, oldRow } = selectedPieceLocation;
    const rowDiff = Math.abs(newRow - oldRow);
    const colDiff = Math.abs(newCol - oldCol);
    const horizontalStep = newCol > oldCol ? 1 : -1;
    const verticalStep = newRow > oldRow ? 1 : -1;

    if (rowDiff !== colDiff) {
        return false;
    }

    let c = oldCol + horizontalStep;
    let r = oldRow + verticalStep

    while (c !== newCol && r !== newRow) {
        if (board[r][c]) {
            return false;
        }
        c += horizontalStep;
        r += verticalStep;
    }

    // check destination
    const target = board[newRow][newCol];

    return !target || target.color !== color;
}

const checkIfKingMovementIsAllowed = (selectedPiece: Piece, selectedPieceLocation: PieceLocation, newRow: number, newCol: number, board: (Piece | null)[][]): boolean => {
    const { oldRow, oldCol } = selectedPieceLocation;
    const { color, hasMoved } = selectedPiece;
    const rowDiff = Math.abs(newRow - oldRow);
    const colDiff = Math.abs(newCol - oldCol);
    const rookCol = newCol > oldCol ? 7 : 0;
    const rook = board[oldRow][rookCol];
    const isValidRook = rook?.type === "rook" && !rook?.hasMoved;

    // 1 move in any direction
    if (rowDiff <= 1 && colDiff <= 1 && (rowDiff !== 0 || colDiff !== 0)) {
        const target = board[newRow][newCol];
        return !target || target.color !== color;
    }
    // castling
    if (!hasMoved && isValidRook && colDiff === 2 && newRow === oldRow) {
        const step = newCol > oldCol ? 1 : -1;
        for (let c = oldCol + step; c !== rookCol; c += step) {
            if (board[oldRow][c]) return false;
        }
        return true;
    }

    return false;
}