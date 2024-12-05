class GameController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.selectedPiece = null;
        this.piecePlacedThisTurn = false;
        this.currentAction = "pick";
        this.view.renderBoard(this.model.board);
        this.view.renderElephantsBanc(this.model.bancElephants);
        this.view.renderRhinocerosBanc(this.model.bancRhinoceros);
        this.addEventListeners();
    }

    addEventListeners() {
        this.view.bancElephantsElement.addEventListener("click", (event) =>
            this.handleBancClick(event, "elephant"),
        );
        this.view.bancRhinocerosElement.addEventListener("click", (event) =>
            this.handleBancClick(event, "rhinoceros"),
        );
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

    ajouterEvenement(message) {
        const listeEvenements = document.getElementById("liste-evenements");
        const nouvelEvenement = document.createElement("li");
        nouvelEvenement.textContent = message;
        listeEvenements.appendChild(nouvelEvenement);
        listeEvenements.scrollTop = listeEvenements.scrollHeight;
    }

    handleBancClick(event, type) {
        if (this.currentAction !== "pick") {
            this.ajouterEvenement("Vous devez terminer l'action actuelle avant de sélectionner une pièce.");
            return;
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
                this.ajouterEvenement(`Pièce sélectionnée : ${this.selectedPiece.name}`);
                this.currentAction = "place";
            } else {
                console.log("Aucune pièce valide sélectionnée.");
            }
        }
    }

    tournerPiece(direction) {
        if (this.currentAction !== "orient") {
            this.ajouterEvenement("Vous devez poser une pièce avant de choisir son orientation.");
            return;
        }

        if (!this.selectedPiece) {
            this.ajouterEvenement("Aucune pièce sélectionnée pour tourner.");
            return;
        }

        switch (direction) {
            case "gauche":
                this.selectedPiece.orientation = -90;
                break;
            case "droite":
                this.selectedPiece.orientation = 90;
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
        if (this.currentAction !== "place") {
            this.ajouterEvenement("Vous devez d'abord sélectionner une pièce avant de la poser.");
            return;
        }

        if (target.classList.contains("case")) {
            const row = parseInt(target.dataset.row);
            const col = parseInt(target.dataset.col);

            if (!this.model.isEntryAllowed(row, col)) {
                this.ajouterEvenement("Cette case est interdite pour l'entrée.");
                return;
            }

            if (this.selectedPiece) {
                this.model.movePiece(this.selectedPiece.name, { row, col });
                this.model.removePieceFromBanc(this.selectedPiece.name);
                this.view.renderBoard(this.model.board);
                this.view.renderElephantsBanc(this.model.bancElephants);
                this.view.renderRhinocerosBanc(this.model.bancRhinoceros);
                this.view.highlightLastMovedPiece(this.selectedPiece.name);
                this.ajouterEvenement(`Pièce ${this.selectedPiece.name} placée sur le plateau.`);
                this.currentAction = "orient";
            }
        }
    }

    terminerTour() {
        if (this.currentAction !== "end") {
            this.ajouterEvenement("Vous devez terminer toutes les actions avant de terminer le tour.");
            return;
        }

        this.ajouterEvenement(`Tour terminé pour ${this.model.getActivePlayer()}.`);
        this.model.incrementTurn();
        this.selectedPiece = null;
        this.piecePlacedThisTurn = false;
        this.currentAction = "pick";
        this.model.switchPlayer();
        this.view.updateActivePlayer(this.model.getActivePlayer());
        this.ajouterEvenement(`C'est maintenant au tour des ${this.model.getActivePlayer()}.`);
    }

}

document.addEventListener("DOMContentLoaded", () => {
    const model = new GameModel();
    const view = new GameView();
    const controller = new GameController(model, view);
});
