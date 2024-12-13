class GameController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.selectedPiece = null;
        this.piecePlacedThisTurn = false;
        this.view.renderBoard(this.model.board, true);
        this.view.renderElephantsBanc(this.model.bancElephants);
        this.view.renderRhinocerosBanc(this.model.bancRhinoceros);
        this.addEventListeners();
        this.addDirectionButtonsEventListeners()
        this.view.highlightSelectablePieces(this.model.getActivePlayer());

    }

    addEventListeners() {
        // Ajoute les événements de clic sur les bancs et le plateau
        if (this.view.bancElephantsElement) {
            this.view.bancElephantsElement.addEventListener("click", (event) =>
                this.handleBancClick(event, "elephant"),
            );
        } else {
            console.error("Le banc des éléphants n'a pas été trouvé.");
        }

        if (this.view.bancRhinocerosElement) {
            this.view.bancRhinocerosElement.addEventListener("click", (event) =>
                this.handleBancClick(event, "rhinoceros"),
            );
        } else {
            console.error("Le banc des rhinocéros n'a pas été trouvé.");
        }

        this.view.boardElement.addEventListener("click", (event) =>
            this.handlePlateauClick(event),
        );
        document
            .getElementById("btn-gauche")
            .addEventListener("click", () => this.tournerPiece("gauche"));
        document
            .getElementById("btn-droite")
            .addEventListener("click", () => this.tournerPiece("droite"));
        document
            .getElementById("btn-haut")
            .addEventListener("click", () => this.tournerPiece("haut"));
        document
            .getElementById("btn-bas")
            .addEventListener("click", () => this.tournerPiece("bas"));
        document
            .getElementById("btn-terminer-tour")
            .addEventListener("click", () => this.terminerTour());
    }

    addDirectionButtonsEventListeners() {
        // Ajoute des événements sur les boutons de direction
        const directions = ["haut", "bas", "gauche", "droite"];
        directions.forEach((direction) => {
            const button = document.getElementById(`btn-${direction}`);
            if (button) {
                button.addEventListener("click", () => this.handleDirectionClick(direction));
                button.addEventListener("click", () => this.tournerPieceBanc(direction));
            }
        });
    };

    handleDirectionClick(direction) {
        // Gère le changement de direction d'une pièce
        if (!this.selectedPiece) {
            console.error("Aucune pièce sélectionnée pour changer la direction , vous devez selectionner une pièce.");
            return;
        }
        if (["haut", "bas", "gauche", "droite"].includes(direction)) {
            this.model.updatePieceDirection(this.selectedPiece.name, direction);
            this.selectedPiece.direction = direction;
        } else {
            console.error("Direction inconnue :", direction);
        }
    }

    ajouterEvenement(message) {
        // Ajoute un événement dans la liste d'événements
        const listeEvenements = document.getElementById("liste-evenements");
        const nouvelEvenement = document.createElement("li");
        nouvelEvenement.textContent = message;
        listeEvenements.appendChild(nouvelEvenement);
        listeEvenements.scrollTop = listeEvenements.scrollHeight;
    }

    handleBancClick(event, type) {
        // Gère le clic sur une pièce du banc
        if (this.piecePlacedThisTurn) {
            this.ajouterEvenement("Vous avez déja placé une pièce ce tour-ci.")
            return
        }
        const target = event.target;
        if (type !== this.model.getActivePlayer()) {
            this.ajouterEvenement(`Ce n'est pas le tour des ${type}s.`);
            return;
        }
        if (target.classList.contains("case")) {
            const pieceName = target.dataset.pieceName;
            if (pieceName) {
                this.selectedPiece = this.model.getPieceByName(pieceName);
                if (this.selectedPiece) {
                    const defaultDirection = this.selectedPiece.direction || "haut";
                    this.model.updatePieceDirection(pieceName, defaultDirection);
                    this.ajouterEvenement(`Pièce sélectionnée : ${this.selectedPiece.name}, direction : ${defaultDirection}`);
                }
            } else {
                this.ajouterEvenement("Aucune pièce valide sélectionnée.");
            }
        }
    }

    tournerPieceBanc(direction) {
        // Change l'orientation d'une pièce sur le banc
        if (!this.selectedPiece) console.log("On ne peux pas changer l'orientation d'une pièce deja posé.");
        this.view.renderPieceRotation(this.selectedPiece);
    }

    tournerPiece(direction) {
        // Tourne une pièce sur le plateau
        if (!this.selectedPiece) {
            this.ajouterEvenement("Aucune pièce sélectionnée pour tourner , veuillez selectionner une pièce.");
            return;
        }
        switch (direction) {
            case "gauche":
                this.selectedPiece.orientation -= 90;
                break;
            case "droite":
                this.selectedPiece.orientation += 90;
                break;
            case "haut":
                this.selectedPiece.orientation = 0;
                break;
            case "bas":
                this.selectedPiece.orientation = 180;
                break;
            default:
                console.log("Direction invalide");
                return;
        }
        const pieceElement = this.view.boardElement.querySelector(
            `[data-piece-name='${this.selectedPiece.name}']`
        );
        if (pieceElement) {
            pieceElement.style.transform = `rotate(${this.selectedPiece.orientation}deg)`;
        }
        this.ajouterEvenement(`Pièce ${this.selectedPiece.name} orientée vers ${direction}.`);
    }

    getSelectedPieceDirection() {
        // Retourne la direction actuelle de la pièce sélectionnée
        return this.selectedPiece ? this.selectedPiece.direction : null
    }

    handlePlateauClick(event) {
        // Gère le clic sur une case du plateau
        const target = event.target;
        if (target.classList.contains("case")) {
            const row = parseInt(target.dataset.row);
            const col = parseInt(target.dataset.col);
            // verifie si l'entrée est permise
            if (!this.model.isEntryAllowed(row, col)) {
                this.ajouterEvenement("Cette case est interdite pour l'entrée.");
                return;
            }
            const direction = this.getSelectedPieceDirection();
            if (!direction) {
                this.ajouterEvenement("Aucune direction valide pour la pièce.");
                return;
            }
            const occupyingPiece = this.model.getPieceAt(row, col);
            if (this.selectedPiece) {
                // Vérifie si la pièce à pousser existe
                if (occupyingPiece) {
                    const pushChain = [];
                    let currentRow = row;
                    let currentCol = col;
                    // Récupère la chaîne de poussée
                    while (this.model.getPieceAt(currentRow, currentCol)) {
                        const nextPiece = this.model.getPieceAt(currentRow, currentCol);
                        pushChain.push(nextPiece);
                        const nextPosition = this.model.getPositionInDirection(
                            { row: currentRow, col: currentCol },
                            direction
                        );
                        if (!nextPosition || !this.model.isPositionValid(nextPosition.row, nextPosition.col)) {
                            break;
                        }
                        currentRow = nextPosition.row;
                        currentCol = nextPosition.col;
                    }
                    // Calcul des forces avec prise en compte des directions
                    const pushingForce = this.selectedPiece.force;
                    const chainForce = this.model.calculateForce(pushChain, direction);
                    if (pushingForce < chainForce) {
                        this.ajouterEvenement("Poussée invalide : force insuffisante.");
                        return; // Bloque la poussée si la force est insuffisante
                    }
                }
                // Si pas de problème de poussée, déplacer la pièce sélectionnée
                this.model.movePiece(this.selectedPiece.name, { row, col }, direction);
                this.model.removePieceFromBanc(this.selectedPiece.name);
                this.view.renderBoard(this.model.board, false);
                this.view.renderElephantsBanc(this.model.bancElephants);
                this.view.renderRhinocerosBanc(this.model.bancRhinoceros);
                this.view.highlightLastMovedPiece(this.selectedPiece.name);
                this.ajouterEvenement(`Pièce ${this.selectedPiece.name} placée sur le plateau.`);
                this.piecePlacedThisTurn = true;
            }
            this.selectedPiece = null;
        }
    }

    terminerTour() {
        // Termine le tour en cours et passe au joueur suivant
        this.ajouterEvenement(`Tour terminé pour ${this.model.getActivePlayer()}.`);
        this.model.incrementTurn();
        this.selectedPiece = null;
        this.piecePlacedThisTurn = false;
        this.model.switchPlayer();
        this.view.updateActivePlayer(this.model.getActivePlayer());
        this.view.renderBoard(this.model.board, true);
        this.view.highlightSelectablePieces(this.model.getActivePlayer());
        this.ajouterEvenement(`C'est maintenant au tour des ${this.model.getActivePlayer()}.`);
    }

}
document.addEventListener("keydown", (event) => {
    // Gère les entrées clavier pour les directions et la fin de tour
    switch (event.key) {
        case "ArrowLeft":
            handleKeyboardInput("gauche");
            break;
        case "ArrowRight":
            handleKeyboardInput("droite");
            break;
        case "ArrowUp":
            handleKeyboardInput("haut");
            break;
        case "ArrowDown":
            handleKeyboardInput("bas");
            break;
        case "Enter":
            handleEndTurn();
            break;
        default:
            break;
    }
});

function handleKeyboardInput(direction) {
    // Simule un clic sur un bouton de direction
    const directionButton = document.querySelector(`[data-direction="${direction}"]`);
    if (directionButton) {
        directionButton.click();
    }
}

function handleEndTurn() {
    // Simule un clic sur le bouton de fin de tour
    console.log("Fin de tour via clavier.");
    const endTurnButton = document.getElementById("btn-terminer-tour");
    if (endTurnButton) {
        endTurnButton.click();
    }
}


document.addEventListener("DOMContentLoaded", () => {
    // Initialise le jeu une fois la page chargée
    const model = new GameModel();
    const view = new GameView(model);
    const controller = new GameController(model, view);
});

