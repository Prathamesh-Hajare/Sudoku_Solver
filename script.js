var arr = Array.from({ length: 9 }, () => Array(9).fill(null));
var board = Array.from({ length: 9 }, () => Array(9).fill(0));

// Initialize the grid
for (var i = 0; i < 9; i++) {
    for (var j = 0; j < 9; j++) {
        arr[i][j] = document.getElementById(i * 9 + j);
    }
}

function FillBoard(board) {
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            arr[i][j].innerText = board[i][j] !== 0 ? board[i][j] : '';
        }
    }
}

let GetPuzzle = document.getElementById('GetPuzzle');
let SolvePuzzle = document.getElementById('SolvePuzzle');

GetPuzzle.onclick = function() {
    var xhrRequest = new XMLHttpRequest();
    xhrRequest.onload = function() {
        var response = JSON.parse(xhrRequest.response);
        console.log(response);
        board = response.board;
        FillBoard(board);
    };
    xhrRequest.open('get', 'https://sugoku.onrender.com/board?difficulty=easy');
    xhrRequest.send();
}

SolvePuzzle.onclick = () => {
    sudukoSolver(board, 0, 0, 9);
};

function isSafe(board, row, col, val, n) {
    // Row and Column check
    for (let i = 0; i < n; i++) {
        if (board[row][i] == val || board[i][col] == val) return false;
    }

    // Submatrix check
    let rn = Math.sqrt(n);
    let si = row - (row % rn);
    let sj = col - (col % rn);
    for (let x = si; x < si + rn; x++) {
        for (let y = sj; y < sj + rn; y++) {
            if (board[x][y] == val) return false;
        }
    }

    return true;
}

function sudukoSolver(board, row, col, n) {
    // Base case
    if (row == n) {
        FillBoard(board);
        return true;
    }

    // If we are at the last column
    if (col == n) {
        return sudukoSolver(board, row + 1, 0, n);
    }

    // If cell is already filled
    if (board[row][col] != 0) {
        return sudukoSolver(board, row, col + 1, n);
    }

    // Try possible values
    for (let val = 1; val <= 9; val++) {
        // Check if the value is safe
        if (isSafe(board, row, col, val, n)) {
            board[row][col] = val;
            // Recursive call
            if (sudukoSolver(board, row, col + 1, n)) {
                return true;
            }
            // Backtracking
            board[row][col] = 0;
        }
    }

    return false;
}
