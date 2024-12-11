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
      new Piece("rocher 1", "rocher_1", null, {row: 2, col: 1}),
      new Piece("rocher 2", "rocher_2", null, {row: 2, col: 2}),
      new Piece("rocher 3", "rocher_3", null, {row: 2, col: 3}),
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
    const board = Array.from({length: 5}, () => Array(5).fill(null));
    this.pieces.forEach((piece) => {
      if (piece.position) {
        board[piece.position.row][piece.position.col] = piece;
      }
    });
    return board;
  }

  // Trouver la position actuelle du rocher
  findRock() {
    for (let row = 0; row < this.board.length; row++) {
      for (let col = 0; col < this.board[row].length; col++) {
        if (this.board[row][col] && this.board[row][col].type.startsWith('rocher')) {
          return {row, col};
        }
      }
    }
    return null; // Aucun rocher trouvé
  }

  moveRock() {
    let rockPos = this.findRock();
    if (rockPos) {
      let {row, col} = rockPos;
      if (col < this.board[0].length - 1 && this.board[row][col + 1] === null) {
        // Déplacer le rocher
        this.board[row][col + 1] = {type: 'rocher'};
        this.board[row][col] = null;
        return true;
      } else {
        console.log("Le rocher ne peut pas se déplacer.");
      }
    }
    return false; // Retourner false si le déplacement échoue
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

  movePieceWithPush(name, to, direction) {
    const piece = this.getPieceByName(name);
    if (!piece) return;

    // Vérifier les limites du plateau
    const {row: nextRow, col: nextCol} = to;
    if (nextRow < 0 || nextRow >= 5 || nextCol < 0 || nextCol >= 5) {
      console.log("Poussée impossible : hors du plateau.");
      return false;
    }

    // Vérifier si la pièce à pousser peut être déplacée
    if (!this.canPush(piece.position.row, piece.position.col, direction)) {
      console.log("Poussée impossible : blocage ou conditions non remplies.");
      return false;
    }

    // Récupérer la pièce sur la prochaine case (si existante)
    const pushedPiece = this.getPieceAt(nextRow, nextCol);
    if (pushedPiece) {
      // Calculer la case suivante dans la direction de la poussée
      const offsetRow = nextRow - piece.position.row;
      const offsetCol = nextCol - piece.position.col;
      const nextPosition = {row: nextRow + offsetRow, col: nextCol + offsetCol};

      // Pousser la pièce suivante récursivement
      const pushSuccess = this.movePieceWithPush(pushedPiece.name, nextPosition, direction);
      if (!pushSuccess) {
        console.log("Poussée bloquée par une pièce ou limite.");
        return false;
      }
    }

    // Déplacer la pièce actuelle sur la case cible
    this.movePiece(name, to);
    return true;
  }


  incrementTurn() {
    this.turnCount += 1;
  }

  movePiece(pieceName, newPosition) {
    const piece = this.getPieceByName(pieceName);

    // Déplacer la pièce sur le plateau
    if (piece) {
      // Supprimer la pièce de la case précédente
      if (piece.position) {
        this.board[piece.position.row][piece.position.col] = null;
      } else {
        this.removePieceFromBanc(pieceName);
      }

      // Mettre à jour la position de la pièce
      piece.position = newPosition;
      this.board[newPosition.row][newPosition.col] = piece;

      console.log(`Pièce ${piece.name} déplacée à (${newPosition.row}, ${newPosition.col})`);

      // Mettre à jour la dernière pièce déplacée
      this.lastMovedPiece = piece;  // Assurez-vous de mettre à jour cette variable
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
    if (
        this.turnCount < 2 &&
        ((row === 0 && col === 2) || (row === 4 && col === 2))
    ) {
      return false;
    }

    if (pushing) {
      return true
    }
    return !this.getPieceAt(row, col);
  }

  canPush(row, col, direction) {
    let currentRow = row;
    let currentCol = col;

    while (true) {
      const piece = this.getPieceAt(currentRow, currentCol);

      // Si aucune pièce n'est trouvée à la position actuelle, la poussée est possible
      if (!piece) return true;

      // Si la pièce est un rocher, on essaie de pousser ce rocher
      if (piece.type === 'rocher') {
        // Calculer la case suivante dans la direction spécifiée
        let nextRow = currentRow, nextCol = currentCol;
        switch (direction) {
          case "top":
            nextRow--;
            break;
          case "bottom":
            nextRow++;
            break;
          case "left":
            nextCol--;
            break;
          case "right":
            nextCol++;
            break;
        }

        // Vérifiez si la case suivante est hors du plateau
        if (nextRow < 0 || nextRow >= 5 || nextCol < 0 || nextCol >= 5) {
          return false; // La poussée échoue si elle sort du plateau
        }

        // Si la case suivante est vide, alors la poussée est possible
        return !this.getPieceAt(nextRow, nextCol);
      }

      // Si la case est occupée par une autre pièce que le rocher, la poussée échoue
      return false;
    }


  }

  pushPiece(fromRow, fromCol, toRow, toCol) {
    const targetPiece = this.getPieceAt(toRow, toCol);

    // Vérifier si la case cible est occupée
    if (targetPiece) {
      const nextRow = toRow + (toRow - fromRow);
      const nextCol = toCol + (toCol - fromCol);

      // Vérifier si la prochaine case est libre pour pousser
      if (!this.getPieceAt(nextRow, nextCol) && this.isInBounds(nextRow, nextCol)) {
        // Déplacer la pièce déjà présente
        this.movePiece(toRow, toCol, nextRow, nextCol);
        // Déplacer la nouvelle pièce vers la case cible
        this.movePiece(fromRow, fromCol, toRow, toCol);
        return true;
      } else {
        console.log("Impossible de pousser la pièce : pas d'espace libre.");
        return false;
      }
    } else {
      console.log("La case cible est vide, aucune poussée nécessaire.");
      // Déplacer la pièce normalement
      this.movePiece(fromRow, fromCol, toRow, toCol);
      return true;
    }
  }
}