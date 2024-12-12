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
    this.GameController = GameController;

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
      this.bancElephants.find((piece) => piece.name === name) ||
      this.bancRhinoceros.find((piece) => piece.name === name)
    );
  }


  incrementTurn() {
    this.turnCount += 1;
  }

  updatePieceDirection(pieceName, direction) {
    const piece = this.getPieceByName(pieceName);

    if (piece) {
      piece.direction = direction; // Met à jour la direction
      console.log(`Direction de la pièce ${piece.name} mise à jour : ${direction}`);
    } else {
      console.error(`Impossible de trouver la pièce avec le nom : ${pieceName}`);
    }
  }



  movePiece(pieceName, newPosition, direction) {
    const piece = this.getPieceByName(pieceName);

    if (piece) {
      // Vérifier si une pièce occupe déjà la case cible
      const occupyingPiece = this.getPieceAt(newPosition.row, newPosition.col);

      if (occupyingPiece) {
        // Déterminer la direction de déplacement pour la pièce existante
        const targetDirection = piece.direction || "droite"; // Par défaut "haut" si aucune direction n'est précisée
        const newPositionForOccupyingPiece = this.getPositionInDirection(newPosition, targetDirection);

        // Vérifiez que la nouvelle position est valide et libre
        if (
          newPositionForOccupyingPiece &&
          this.isPositionValid(newPositionForOccupyingPiece.row, newPositionForOccupyingPiece.col) &&
          !this.getPieceAt(newPositionForOccupyingPiece.row, newPositionForOccupyingPiece.col)
        ) {
          // Déplacer la pièce existante
          this.board[occupyingPiece.position.row][occupyingPiece.position.col] = null;
          occupyingPiece.position = newPositionForOccupyingPiece;
          this.board[newPositionForOccupyingPiece.row][newPositionForOccupyingPiece.col] = occupyingPiece;

          console.log(`Déplacement de la pièce ${occupyingPiece.name} vers (${newPositionForOccupyingPiece.row}, ${newPositionForOccupyingPiece.col})`);
        } else {
          console.error("Impossible de déplacer la pièce existante, aucune position valide.");
          return;
        }
      }

      // Maintenant, déplacer la nouvelle pièce
      if (piece.position) {
        this.board[piece.position.row][piece.position.col] = null;
      } else {
        this.removePieceFromBanc(pieceName);
      }

      piece.position = newPosition;
      this.board[newPosition.row][newPosition.col] = piece;

      console.log(`Pièce ${piece.name} déplacée à (${newPosition.row}, ${newPosition.col})`);
      this.lastMovedPiece = piece;
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

  isEntryAllowed(row, col, pushing = true) {
    // ne pas oublier de le faire aussi pour 1,1 ; 1,2 ; 1,3  
    if (
      this.turnCount < 2 &&
      ((row === 0 && col === 2) || (row === 4 && col === 2)) || ((row === 1 && col === 1)) || ((row === 1 && col === 2)) || ((row === 1 && col === 3)) ||
        ((row === 3 && col === 1)) || ((row === 3 && col === 2)) || ((row === 3 && col === 3))
    ) {
      return false;
    }

    if (pushing) {
      return true
    }
    return !this.getPieceAt(row, col);
  }

  getPieceAt(row, col) {
    return this.board[row] && this.board[row][col] ? this.board[row][col] : null;
  }

  isPositionValid(row, col) {
    return row >= 0 && row < this.board.length && col >= 0 && col < this.board[0].length;
  }

  getPositionInDirection(startPosition, direction) {
    const directions = {
      "bas": { row: startPosition.row + 1, col: startPosition.col },
      "haut": { row: startPosition.row, col: startPosition.col },
      "gauche": { row: startPosition.row, col: startPosition.col - 1 },
      "droite": { row: startPosition.row, col: startPosition.col + 1 },
    };
    /*
    console.log("je suis kebabier" + this.GameControllerselectedPiece.direction)
    console.log("je suis ker" + directions[direction])*/
    return directions[direction];
  }

}