class Piece {
  constructor(name, type, player, position, orientation = 0) {
    this.name = name;
    this.type = type;
    this.player = player;
    this.position = position;
    this.orientation = orientation;
  }
}

class GameModel {
  constructor() {
    this.turnCount = 1;
    this.pieces = this.initializePieces();
    this.board = this.initializeBoard();
    this.bancElephants = this.initializeElephantsBanc();
    this.bancRhinoceros = this.initializeRhinocerosBanc();
    this.currentPlayer = "elephant";
    this.lastMovedPiece = null;
  }

  initializePieces() {
    return [
      new Piece("rocher 1", "rocher_1", null, { row: 2, col: 1 }),
      new Piece("rocher 2", "rocher_2", null, { row: 2, col: 2 }),
      new Piece("rocher 3", "rocher_3", null, { row: 2, col: 3 }),
    ];
  }
  initializeElephantsBanc() {
    return [
      new Piece("elephant 1", "éléphant_1", "player1", null),
      new Piece("elephant 2", "éléphant_2", "player1", null),
      new Piece("elephant 3", "éléphant_3", "player1", null),
      new Piece("elephant 4", "éléphant_4", "player2", null),
      new Piece("elephant 5", "éléphant_5", "player2", null),
    ];
  }

  initializeRhinocerosBanc() {
    return [
      new Piece("rhinoceros 1", "rhino_1", "player1", null),
      new Piece("rhinoceros 2", "rhino_2", "player1", null),
      new Piece("rhinoceros 3", "rhino_3", "player1", null),
      new Piece("rhinoceros 4", "rhino_4", "player2", null),
      new Piece("rhinoceros 5", "rhino_5", "player2", null),
    ];
  }

  initializeBoard() {
    const board = Array.from({ length: 5 }, () => Array(5).fill(null));
    this.pieces.forEach((piece) => {
      if (piece.position) {
        board[piece.position.row][piece.position.col] = piece;
      }
    });
    return board;
  }

  switchPlayer() {
    this.currentPlayer =
      this.currentPlayer === "elephant" ? "rhinoceros" : "elephant";
  }

  getActivePlayer() {
    return this.currentPlayer;
  }

  isGameStateValid() {
    return true;
  }

  getPieceAt(row, col) {
    return this.board[row][col];
  }
  getPieceByName(name) {
    return (
        this.pieces.find((piece) => piece.name === name) ||
        this.bancRhinoceros.find((piece) => piece.name === name) ||
        this.bancElephants.find((piece) => piece.name === name)
    );
  }


  incrementTurn() {
    this.turnCount += 1;
  }

  movePiece(name, to) {
    const piece = this.getPieceByName(name);
    if (piece) {
      if (piece.position) {
        this.board[piece.position.row][piece.position.col] = null;
      } else {
        this.removePieceFromBanc(name);
      }
      piece.position = to;
      this.board[to.row][to.col] = piece;
      console.log(`Pièce ${piece.name} déplacée à (${to.row}, ${to.col})`);
    }
  }

  removePieceFromBanc(name) {
    this.bancElephants = this.bancElephants.filter(
      (piece) => piece.name !== name,
    );

    this.bancRhinoceros = this.bancRhinoceros.filter(
      (piece) => piece.name !== name,
    );
  }

  removePieceAt(row, col) {
    if (this.board[row][col]) {
      this.board[row][col] = null;
    }
  }

  isEntryAllowed(row, col) {
    // Bloque l'entrée dans les zones interdites pour les premiers tours
    if (
        this.turnCount <= 2 &&
        ((row === 0 && col === 2) || (row === 4 && col === 2))
    ) {
      return false;
    }
    // Bloque l'entrée si une pièce est déjà présente sur la case
    return !this.getPieceAt(row, col);
  }



}