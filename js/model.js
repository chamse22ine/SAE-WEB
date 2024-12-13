class Piece {
  constructor(name, type, player, position, orientation = 0, force = 1) {
    this.name = name;
    this.type = type;
    this.player = player;
    this.position = position;
    this.orientation = orientation;
    this.force = force;
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
    // Initialise les rochers sur le plateau avec leurs positions par défaut 
    //nom,type,joueur (ici nul car les rochers appartient a personne), position sur le plateau , orientation , force
    return [
      new Piece("rocher 1", "rocher_1", null, { row: 2, col: 1 }, 0, 1),
      new Piece("rocher 2", "rocher_2", null, { row: 2, col: 2 }, 0, 1),
      new Piece("rocher 3", "rocher_3", null, { row: 2, col: 3 }, 0, 1),
    ];
  }

  initializeElephantsBanc() {
    // Initialise le banc des elephants
    //nom,type,joueur, position (null car ils sont sur le banc et non sur le plateau de base) , orientation , force
    return [
      new Piece("elephant 1", "éléphant_1", "player1", null, 0, 2),
      new Piece("elephant 2", "éléphant_2", "player1", null, 0, 2),
      new Piece("elephant 3", "éléphant_3", "player1", null, 0, 2),
      new Piece("elephant 4", "éléphant_4", "player1", null, 0, 2),
      new Piece("elephant 5", "éléphant_5", "player1", null, 0, 2),
    ];
  }

  initializeRhinocerosBanc() {
    //Initialise le banc des rhinoceros
    return [
      new Piece("rhinoceros 1", "rhino_1", "player2", null, 0, 2),
      new Piece("rhinoceros 2", "rhino_2", "player2", null, 0, 2),
      new Piece("rhinoceros 3", "rhino_3", "player2", null, 0, 2),
      new Piece("rhinoceros 4", "rhino_4", "player2", null, 0, 2),
      new Piece("rhinoceros 5", "rhino_5", "player2", null, 0, 2),
    ];
  }

  initializeBoard() {
    // Crée un plateau vide et place les pièces initiales dessus
    const board = Array.from({ length: 5 }, () => Array(5).fill(null));
    this.pieces.forEach((piece) => {
      if (piece.position) {
        board[piece.position.row][piece.position.col] = piece;
      }
    });
    return board;
  }

  switchPlayer() {
    // Change le joueur actif
    this.currentPlayer =
      this.currentPlayer === "elephant" ? "rhinoceros" : "elephant";
  }

  getActivePlayer() {
    // Retourne le joueur actif
    return this.currentPlayer;
  }

  getPieceAt(row, col) {
    // Retourne la pièce présente à une position donnée sur le plateau
    return this.board[row][col];
  }

  getPieceByName(name) {
    // Retourne une pièce par son nom, qu'elle soit sur le plateau ou dans un banc
    return (
      this.pieces.find((piece) => piece.name === name) ||
      this.bancElephants.find((piece) => piece.name === name) ||
      this.bancRhinoceros.find((piece) => piece.name === name)
    );
  }

  incrementTurn() {
    // Incrémente le compteur de tours
    this.turnCount += 1;
  }

  updatePieceDirection(pieceName, direction) {
    // Met à jour la direction d'une pièce
    const piece = this.getPieceByName(pieceName);
    if (piece) {
      piece.direction = direction;
    } else {
      console.error(`Impossible de trouver la pièce avec le nom : ${pieceName}`);
    }
  }

  calculateForce(chain, pushDirection) {
    // Calcule la force totale d'une chaîne de poussée
    return chain.reduce((total, piece) => {
      if (this.isDirectionCompatible(piece.direction, pushDirection)) {
        return total;
      }
      return total + piece.force;
    }, 1);
  }

  isDirectionCompatible(pieceDirection, pushDirection) {
    // Vérifie si une pièce est dans la même direction que la poussée ou l'oppose
    const oppositeDirections = {
      haut: "bas",
      bas: "haut",
      gauche: "droite",
      droite: "gauche",
    };
    if (oppositeDirections[pieceDirection] === pushDirection) {
      return false;
    }
    if (pieceDirection === pushDirection) {
      return true;
    }
    return true;
  }

  movePiece(pieceName, newPosition, direction) {
    // Déplace une pièce sur le plateau et gère les poussées
    const piece = this.getPieceByName(pieceName);
    if (piece) {
      let currentRow = newPosition.row;
      let currentCol = newPosition.col;
      const pushChain = [];
      while (this.getPieceAt(currentRow, currentCol)) {
        const occupyingPiece = this.getPieceAt(currentRow, currentCol);
        pushChain.push(occupyingPiece);
        const nextPosition = this.getPositionInDirection({ row: currentRow, col: currentCol }, direction);
        if (!nextPosition || !this.isPositionValid(nextPosition.row, nextPosition.col)) {
          const removedPiece = pushChain.pop();
          if (removedPiece.type.startsWith("rocher")) {
            console.log("Un rocher a été poussé hors du plateau.");
            this.onVictory(removedPiece, piece);
            return; // Stoppe l'exécution après la victoire
          } else {
            console.log(`La pièce ${removedPiece.name} est renvoyée au banc.`);
            this.returnPieceToBanc(removedPiece); // Renvoie la pièce au banc
            break;
          }
        }

        currentRow = nextPosition.row;
        currentCol = nextPosition.col;
      }

      // Déplace toutes les pièces dans la chaîne de poussée
      for (let i = pushChain.length - 1; i >= 0; i--) {
        const pieceToMove = pushChain[i];
        const nextPosition = this.getPositionInDirection(pieceToMove.position, direction);

        this.board[pieceToMove.position.row][pieceToMove.position.col] = null;
        pieceToMove.position = nextPosition;
        this.board[nextPosition.row][nextPosition.col] = pieceToMove;
      }
      if (piece.position) {
        this.board[piece.position.row][piece.position.col] = null;
      } else {
        this.removePieceFromBanc(pieceName);
      }
      piece.position = newPosition;
      this.board[newPosition.row][newPosition.col] = piece;
      console.log(`Pièce ${piece.name} déplacée à (${newPosition.row}, ${newPosition.col})`);
      this.lastMovedPiece = piece;
      if (this.checkVictoryCondition()) {
        console.log("Victoire ! Un rocher a quitté le plateau.");
      }
    } else {
      console.error(`Impossible de trouver la pièce avec le nom : ${pieceName}`);
    }
  }

  returnPieceToBanc(piece) {
    //renvoie la pièce sur le banc
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
    //Verifie si les conditions de victoires sont réunies
    for (const piece of this.pieces) {
      if (piece.type.startsWith("rocher") && (!piece.position || !this.isPositionValid(piece.position.row, piece.position.col))) {
        return true;
      }
    }
    return false;
  }

  onVictory(rock, pushingPiece) {
    // Gère la logique de victoire lorsqu'un rocher est poussé hors du plateau
    if (!pushingPiece || !pushingPiece.player) {
      alert("Aucun gagnant détecté.");
      console.log("Fin de la partie sans gagnant.");
      return;
    }

    const direction = pushingPiece.direction;
    const rockPosition = rock.position;
    const potentialWinner = this.findClosestPieceRock(rockPosition, direction, pushingPiece);

    if (potentialWinner) {
      const winner = `Le joueur ${potentialWinner.player}`;
      let victoryMessage = "";
      let victoryImageUrl = "";

      if (potentialWinner.player === "player1") {
        victoryMessage = `Félicitations les Elephants! ${potentialWinner.name} a remporté la victoire en poussant le rocher ${rock.name} hors du plateau !`;
        victoryImageUrl = '../assets/images/victoire/victoire-elephant.png';
      } else {
        victoryMessage = `Bravo les Rhinos! ${potentialWinner.name} a gagné en poussant le rocher ${rock.name} !`;
        victoryImageUrl = '../assets/images/victoire/victoire-rhino.png';
      }

      alert(victoryMessage);
      console.log(`Fin de la partie. ${winner} a gagné.`);

      const victoryImage = document.createElement("img");
      victoryImage.src = victoryImageUrl;
      victoryImage.alt = "Image de victoire";
      victoryImage.style.width = "500px";
      victoryImage.style.height = "auto";

      const victoryContainer = document.getElementById("victory-container");
      if (victoryContainer) {
        victoryContainer.innerHTML = '';
        victoryContainer.appendChild(victoryImage);
      }

    } else {
      console.log("Fin de la partie sans gagnant clair.");
    }
  }

  findClosestPieceRock(rockPosition, direction, pushingPiece) {
    // Trouve la pièce la plus proche dans la direction du rocher poussé
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
    // Trouve la pièce la plus proche d'une position donnée
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
    // Retire une pièce du banc par son nom
    this.bancElephants = this.bancElephants.filter(
      (piece) => piece.name !== name,
    );
    this.bancRhinoceros = this.bancRhinoceros.filter(
      (piece) => piece.name !== name,
    );
  }

  removePieceAt(row, col) {
    // Retire une pièce d'une position spécifique sur le plateau
    if (this.board[row][col]) {
      this.board[row][col] = null;
    }
  }

  isEntryAllowed(row, col, pushing = true) {
    // Vérifie si une entrée est autorisée sur une case
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
    // Retourne la pièce présente sur une case donnée
    return this.board[row] && this.board[row][col] ? this.board[row][col] : null;
  }

  isPositionValid(row, col) {
    // Vérifie si une position est valide sur le plateau
    return row >= 0 && row < this.board.length && col >= 0 && col < this.board[0].length;
  }

  getPositionInDirection(startPosition, direction) {
    // Retourne la position dans une direction donnée à partir d'une position de départ
    const directions = {
      "bas": { row: startPosition.row + 1, col: startPosition.col },
      "haut": { row: startPosition.row - 1, col: startPosition.col },
      "gauche": { row: startPosition.row, col: startPosition.col - 1 },
      "droite": { row: startPosition.row, col: startPosition.col + 1 },
    };
    return directions[direction] || null;
  }
}