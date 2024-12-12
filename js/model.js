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
      new Piece("elephant 4", "éléphant_4", "player1", null),
      new Piece("elephant 5", "éléphant_5", "player1", null),
    ];
  }

  initializeRhinocerosBanc() {
    return [
      new Piece("rhinoceros 1", "rhino_1", "player2", null),
      new Piece("rhinoceros 2", "rhino_2", "player2", null),
      new Piece("rhinoceros 3", "rhino_3", "player2", null),
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
      piece.direction = direction;
      console.log(`Direction de la pièce ${piece.name} mise à jour : ${direction}`);
    } else {
      console.error(`Impossible de trouver la pièce avec le nom : ${pieceName}`);
    }
  }

  movePiece(pieceName, newPosition, direction) {
    const piece = this.getPieceByName(pieceName);

    if (piece) {
      let currentRow = newPosition.row;
      let currentCol = newPosition.col;

      // Collecte toutes les pièces dans la chaîne de poussée
      const pushChain = [];
      while (this.getPieceAt(currentRow, currentCol)) {
        const occupyingPiece = this.getPieceAt(currentRow, currentCol);
        pushChain.push(occupyingPiece);
        const nextPosition = this.getPositionInDirection({ row: currentRow, col: currentCol }, direction);

        // Vérifie si la prochaine position est valide
        if (!nextPosition || !this.isPositionValid(nextPosition.row, nextPosition.col)) {
          const removedPiece = pushChain.pop();
          if (removedPiece.type.startsWith("rocher")) {
            console.log("Un rocher a été poussé hors du plateau.");
            this.onVictory(removedPiece, piece); // Passe le rocher et la pièce poussante
            return; // Stoppe l'exécution après la victoire
          }

          this.returnPieceToBanc(removedPiece); // Renvoie les autres pièces sur le banc
          break;
        }

        currentRow = nextPosition.row;
        currentCol = nextPosition.col;
      }

      // Déplace toutes les pièces dans la chaîne de poussée
      for (let i = pushChain.length - 1; i >= 0; i--) {
        const pieceToMove = pushChain[i];
        const nextPosition = this.getPositionInDirection(pieceToMove.position, direction);

        this.board[pieceToMove.position.row][pieceToMove.position.col] = null; // Libère la position actuelle
        pieceToMove.position = nextPosition; // Met à jour la position de la pièce
        this.board[nextPosition.row][nextPosition.col] = pieceToMove; // Place la pièce à la nouvelle position
      }

      // Place la pièce qui pousse dans la position initiale
      if (piece.position) {
        this.board[piece.position.row][piece.position.col] = null; // Libère l'ancienne position
      } else {
        this.removePieceFromBanc(pieceName); // Retire du banc si elle y était
      }
      piece.position = newPosition; // Met à jour la position de la pièce poussante
      this.board[newPosition.row][newPosition.col] = piece; // Place la pièce sur le plateau

      console.log(`Pièce ${piece.name} déplacée à (${newPosition.row}, ${newPosition.col})`);
      this.lastMovedPiece = piece;

      // Vérifie la victoire après le déplacement
      if (this.checkVictoryCondition()) {
        console.log("Victoire ! Un rocher a quitté le plateau.");
      }
    } else {
      console.error(`Impossible de trouver la pièce avec le nom : ${pieceName}`);
    }
  }

  returnPieceToBanc(piece) {
    if (piece.type.startsWith("rhino")) {
      this.bancRhinoceros.push(piece);
    } else if (piece.type.startsWith("éléphant")) {
      this.bancElephants.push(piece);
    }

    if (piece.position) {
      this.board[piece.position.row][piece.position.col] = null;
    }

    piece.position = null;
    console.log(`La pièce ${piece.name} a été renvoyée sur le banc approprié.`);
  }

  checkVictoryCondition() {
    for (const piece of this.pieces) {
      if (piece.type.startsWith("rocher") && (!piece.position || !this.isPositionValid(piece.position.row, piece.position.col))) {
        return true;
      }
    }
    return false;
  }
  onVictory(rock, pushingPiece) {
    if (!pushingPiece || !pushingPiece.player) {
      alert("Aucun gagnant détecté.");
      console.log("Fin de la partie sans gagnant.");
      return;
    }

    const direction = pushingPiece.direction;
    const rockPosition = rock.position;
    const potentialWinner = this.findClosestPieceTowardsRock(rockPosition, direction, pushingPiece);

    if (potentialWinner) {
      const winner = `Le joueur ${potentialWinner.player}`;
      if (potentialWinner.player === "player1") {
        alert(`Félicitations les Elephants! ${potentialWinner.name} a remporté la victoire en poussant le rocher ${rock.name} hors du plateau !`);
      } else {
        alert(`Bravo les Rhinos! ${potentialWinner.name} a gagné en poussant le rocher ${rock.name} !`);
      }
      console.log(`Fin de la partie. ${winner} a gagné.`);
    } else {
      alert("Aucun gagnant clair.");
      console.log("Fin de la partie sans gagnant clair.");
    }
  }

  findClosestPieceTowardsRock(rockPosition, direction, pushingPiece) {
    const directions = {
      "bas": { row: 1, col: 0 },
      "haut": { row: -1, col: 0 },
      "gauche": { row: 0, col: -1 },
      "droite": { row: 0, col: 1 },
    };
    const movement = directions[direction];
    if (!movement) return null;

    let row = rockPosition.row - movement.row;
    let col = rockPosition.col - movement.col;

    while (this.isPositionValid(row, col)) {
      const piece = this.getPieceAt(row, col);

      if (piece && piece !== pushingPiece) {
        // Vérifie si la pièce est orientée vers le rocher
        if (piece.direction === direction) {
          return piece;
        }
      }

      row -= movement.row;
      col -= movement.col;
    }

    return null;
  }


  getClosestPiece(row, col) {
    let closestPiece = null;
    let minDistance = Infinity;

    for (const piece of this.pieces) {
      if (piece.position) {
        const distance = Math.abs(piece.position.row - row) + Math.abs(piece.position.col - col);
        if (distance < minDistance) {
          closestPiece = piece;
          minDistance = distance;
        }
      }
    }

    return closestPiece;
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
      this.turnCount <= 2 &&
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
      "haut": { row: startPosition.row - 1, col: startPosition.col },
      "gauche": { row: startPosition.row, col: startPosition.col - 1 },
      "droite": { row: startPosition.row, col: startPosition.col + 1 },
    };
    return directions[direction] || null;
  }




}