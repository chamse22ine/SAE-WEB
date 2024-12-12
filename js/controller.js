class GameController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.selectedPiece = null;
        this.piecePlacedThisTurn = false;
        this.currentAction = "pick";
        this.view.renderBoard(this.model.board, true);
        this.view.renderElephantsBanc(this.model.bancElephants);
        this.view.renderRhinocerosBanc(this.model.bancRhinoceros);
        this.addEventListeners();
        this.addDirectionButtonsEventListeners()
        this.view.highlightSelectablePieces(this.model.getActivePlayer());

    }

    addEventListeners() {
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

        this.view.plateauElement.addEventListener("click", (event) =>
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
        console.log("Direction reçue dans handleDirectionClick :", direction);

        if (!this.selectedPiece) {
            console.error("Aucune pièce sélectionnée pour changer la direction.");
            return;
        }

        if (["haut", "bas", "gauche", "droite"].includes(direction)) {
            this.model.updatePieceDirection(this.selectedPiece.name, direction);
            this.selectedPiece.direction = direction;
            console.log("Direction mise à jour dans le modèle et le contrôleur :", direction);
        } else {
            console.error("Direction inconnue :", direction);
        }
    }

    getSelectedPieceDirection() {
        return this.selectedPiece ? this.selectedPiece.direction : null
    }

    handleBancClick(event, type) {
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
                    console.log(`Pièce sélectionnée : ${this.selectedPiece.name}, direction : ${defaultDirection}`);
                }
                this.currentAction = "place";
            } else {
                console.error("Aucune pièce valide sélectionnée.");
            }
        }
    }


    tournerPieceBanc(direction) {
        if (!this.selectedPiece) console.log("On ne peux pas changer l'orientation d'une pièce deja posé.");

        this.view.renderPieceRotation(this.selectedPiece);
        this.ajouterEvenement(`Pièce ${this.selectedPiece.name} orientée vers ${direction}.`);
        this.currentAction = "end";
    }

    ajouterEvenement(message) {
        const listeEvenements = document.getElementById("liste-evenements");
        const nouvelEvenement = document.createElement("li");
        nouvelEvenement.textContent = message;
        listeEvenements.appendChild(nouvelEvenement);
        listeEvenements.scrollTop = listeEvenements.scrollHeight;
    }

    tournerPiece(direction) {
        if (!this.selectedPiece) {
            this.ajouterEvenement("Aucune pièce sélectionnée pour tourner.");
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
        const pieceElement = this.view.plateauElement.querySelector(
            `[data-piece-name='${this.selectedPiece.name}']`
        );
        if (pieceElement) {
            pieceElement.style.transform = `rotate(${this.selectedPiece.orientation}deg)`;
        }

        this.ajouterEvenement(`Pièce ${this.selectedPiece.name} orientée vers ${direction}.`);
        this.currentAction = "end";
    }

    highlightLastMovedPiece(pieceName) {
        const previousHighlight = this.plateauElement.querySelector('.highlight');
        if (previousHighlight) {
            previousHighlight.classList.remove('highlight');
        }
        const newHighlight = this.plateauElement.querySelector(`[data-piece-name='${pieceName}']`);
        if (newHighlight) {
            newHighlight.classList.add('highlight');
        }
    }

    handlePlateauClick(event) {
        const target = event.target;

        if (target.classList.contains("case")) {
            const row = parseInt(target.dataset.row);
            const col = parseInt(target.dataset.col);
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
            if (occupyingPiece && this.selectedPiece) {
                this.model.movePiece(occupyingPiece.name, { row, col }, direction);
            }
            if (this.selectedPiece) {
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
        this.ajouterEvenement(`Tour terminé pour ${this.model.getActivePlayer()}.`);
        this.model.incrementTurn();
        this.selectedPiece = null;
        this.piecePlacedThisTurn = false; // Réinitialisation
        this.currentAction = "pick";
        this.model.switchPlayer();
        this.view.updateActivePlayer(this.model.getActivePlayer());
        this.view.renderBoard(this.model.board, true);
        this.view.highlightSelectablePieces(this.model.getActivePlayer());
        this.ajouterEvenement(`C'est maintenant au tour des ${this.model.getActivePlayer()}.`);
    }

}

document.addEventListener("DOMContentLoaded", () => {
    const model = new GameModel();
    const view = new GameView(model);
    const controller = new GameController(model, view);
    model.setController(controller);
});

