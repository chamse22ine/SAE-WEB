class Piece {
    constructor(name, type, player, position, orientation = 0) {
        this.name = name; // Nom unique (ex. "elephant1", "rhinoceros3")
        this.type = type; // Type de la pièce (ex. "elephant", "rhinoceros", "rocher")
        this.player = player; // Joueur propriétaire (ex. "player1", null pour les montagnes)
        this.position = position; // Position actuelle { row: x, col: y }
        this.orientation = orientation; // Ajout de l'orientation initiale (0°)

    }
}

class GameModel {
    constructor() {
        this.pieces = this.initializePieces(); // Liste de toutes les pièces
        this.board = this.initializeBoard(); // Plateau contenant les références aux pièces
        this.bancElephants = this.initializeElephantsBanc(); // Liste des éléphants sur le banc
        this.bancRhinoceros = this.initializeRhinocerosBanc(); // Liste des rhinocéros sur le banc
        this.currentPlayer = "player1";
        this.reserve = { player1: 5, player2: 5 }; // Réserve par joueur
        this.lastMovedPiece = null;
        this.gameOver = false;
    }

    initializePieces() {
        return [
            // Montagnes au centre du plateau
            new Piece("rocher 1", "rocher_1", null, { row: 2, col: 1 }),
            new Piece("rocher 2", "rocher_2", null, { row: 2, col: 2 }),
            new Piece("rocher 3", "rocher_3", null, { row: 2, col: 3 }),
            // Aucun rhinocéros directement sur le plateau
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
        this.pieces.forEach(piece => {
            if (piece.position) {
                board[piece.position.row][piece.position.col] = piece;
            }
        });
        return board;
    }

    getPieceAt(row, col) {
        return this.board[row][col];
    }
    getPieceByName(name) {
        return this.pieces.find(piece => piece.name === name) ||
            this.initializeRhinocerosBanc().find(piece => piece.name === name) ||
            this.initializeElephantsBanc().find(piece => piece.name === name);
    }

    movePiece(name, to) {
        const piece = this.getPieceByName(name);
        if (piece) {
            // Retire la pièce de sa position actuelle si elle en a une
            if (piece.position) {
                this.board[piece.position.row][piece.position.col] = null;
            }

            // Met à jour la position
            piece.position = to;

            // Place la pièce sur la nouvelle position du plateau
            this.board[to.row][to.col] = piece;
            this.lastMovedPiece = piece;
        }
    }
    removePieceFromBanc(name) {
        // Retire la pièce du banc des éléphants
        this.bancElephants = this.bancElephants.filter(piece => piece.name !== name);

        // Retire la pièce du banc des rhinocéros
        this.bancRhinoceros = this.bancRhinoceros.filter(piece => piece.name !== name);
    }


}
