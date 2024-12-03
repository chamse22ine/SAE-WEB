class GameController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.selectedPiece = null; // Stocke la pièce sélectionnée
        this.pieceDejaPlacee = null; // Pièce placée pour le tour en cours
        //Test

        // Rendu initial
        this.view.renderBoard(this.model.board);
        this.view.renderElephantsBanc(this.model.bancElephants);
        this.view.renderRhinocerosBanc(this.model.bancRhinoceros);

        // Attache des gestionnaires d'événements
        this.addEventListeners();
    }

    addEventListeners() {
        // Gestion des clics sur le banc des éléphants
        this.view.bancElephantsElement.addEventListener("click", (event) =>
            this.handleBancClick(event, "elephant"),
        );

        // Gestion des clics sur le banc des rhinocéros
        this.view.bancRhinocerosElement.addEventListener("click", (event) =>
            this.handleBancClick(event, "rhinoceros"),
        );

        // Gestion des clics sur le plateau
        this.view.plateauElement.addEventListener("click", (event) =>
            this.handlePlateauClick(event),
        );

        // Gestion des clics sur les boutons de direction
        document
            .getElementById("btn-gauche")
            .addEventListener("click", () => this.tournerPiece("left"));
        document
            .getElementById("btn-droite")
            .addEventListener("click", () => this.tournerPiece("right"));
        document
            .getElementById("btn-haut")
            .addEventListener("click", () => this.tournerPiece("up"));
        document
            .getElementById("btn-bas")
            .addEventListener("click", () => this.tournerPiece("down"));
        document
            .getElementById("btn-terminer-tour")
            .addEventListener("click", () => this.terminerTour());
    }

    tournerPiece(direction) {
        if (!this.selectedPiece) {
            console.log("Aucune pièce sélectionnée pour tourner");
            this.ajouterEvenement("Aucune pièce sélectionnée pour tourner");
            return;
        }

        // Détermine l'angle de rotation en fonction de la direction
        switch (direction) {
            case "left":
                this.selectedPiece.orientation = this.selectedPiece.orientation - 90;
                break;
            case "right":
                this.selectedPiece.orientation = this.selectedPiece.orientation + 90;
                break;
            case "up":
                this.selectedPiece.orientation = 0;
                break;
            case "down":
                this.selectedPiece.orientation = 180;
                break;
        }

        // Applique la rotation à l'élément de la pièce sélectionnée sur le plateau
        const pieceElement = this.view.plateauElement.querySelector(
            `[data-piece-name='${this.selectedPiece.name}']`,
        );
        if (pieceElement) {
            pieceElement.style.transform = `rotate(${this.selectedPiece.orientation}deg)`;
        }

        console.log(`Pièce ${this.selectedPiece.name} tournée vers ${direction}`);
        this.ajouterEvenement(
            `Pièce ${this.selectedPiece.name} tournée vers ${direction}`,
        );
    }

    handleBancClick(event, type) {
        const target = event.target;

        // Vérifie si c'est bien le tour du joueur
        if (type !== this.model.getActivePlayer()) {
            console.log(`Ce n'est pas le tour des ${type}s.`);
            this.ajouterEvenement(`Ce n'est pas le tour des ${type}s.`);
            return;
        }

        if (target.classList.contains("case")) {
            const pieceName = target.dataset.pieceName;
            if (pieceName) {
                // Sélectionne la pièce
                this.selectedPiece = this.model.getPieceByName(pieceName);
                console.log(`Pièce sélectionnée : ${this.selectedPiece.name}`);

                // Ajoute un événement dans l'afficheur
                this.ajouterEvenement(
                    `Sélection de la pièce : ${this.selectedPiece.name}`,
                );
            }
        }
    }

    handlePlateauClick(event) {
        const target = event.target;

        if (target.classList.contains("case")) {
            const row = parseInt(target.dataset.row);
            const col = parseInt(target.dataset.col);
            const clickedPiece = this.model.getPieceAt(row, col);

            if (clickedPiece && clickedPiece.type.startsWith("rocher")) {
                console.log("Impossible de sélectionner un rocher");
                this.ajouterEvenement("Impossible de sélectionner un rocher");
                return;
            }

            // Vérifie si une case contient déjà une pièce
            const piece = this.model.getPieceAt(row, col);

            if (piece) {
                // Si une pièce est présente, elle devient la pièce sélectionnée
                this.selectedPiece = piece;
                console.log(`Pièce re-sélectionnée : ${piece.name}`);
                this.ajouterEvenement(`Pièce re-sélectionnée : ${piece.name}`);
            } else if (this.selectedPiece) {
                // Si une pièce est déjà sélectionnée et qu'on clique sur une case vide, déplacez la pièce
                if (!this.model.getPieceAt(row, col)) {
                    // Supprimer la pièce de son ancienne position
                    const previousPosition = this.selectedPiece.position;
                    if (previousPosition) {
                        this.model.removePieceAt(
                            previousPosition.row,
                            previousPosition.col,
                        );
                    }

                    // Mettre à jour la position dans le modèle
                    this.model.movePiece(this.selectedPiece.name, { row, col });

                    // Mettre à jour l'affichage du plateau
                    this.view.renderBoard(this.model.board);

                    // Mettre à jour les bancs
                    this.view.renderElephantsBanc(this.model.bancElephants);
                    this.view.renderRhinocerosBanc(this.model.bancRhinoceros);

                    // Mettre en évidence la dernière pièce déplacée
                    this.view.highlightLastMovedPiece(this.selectedPiece.name);

                    // Ajouter un événement
                    this.ajouterEvenement(
                        `Pièce ${this.selectedPiece.name} déplacée à la position (${row}, ${col})`,
                    );

                    // La pièce est maintenant jouée pour ce tour
                    this.pieceDejaPlacee = this.selectedPiece;

                    // Optionnel : Désélectionner après le déplacement
                    this.selectedPiece = null;
                } else {
                    console.log("Case déjà occupée");
                    this.ajouterEvenement("Case déjà occupée");
                }
            } else {
                console.log("Aucune pièce sélectionnée pour être déplacée.");
                this.ajouterEvenement("Aucune pièce sélectionnée pour être déplacée.");
            }
        }
    }


    terminerTour() {
        if (this.pieceDejaPlacee) {
            console.log(
                `Tour terminé pour ${this.model.getActivePlayer()} avec la pièce ${this.pieceDejaPlacee.name}`,
            );
            this.ajouterEvenement(
                `Tour terminé pour ${this.model.getActivePlayer()} avec la pièce ${this.pieceDejaPlacee.name}`,
            );

            // Réinitialisation pour le tour suivant
            this.pieceDejaPlacee = null;
            this.selectedPiece = null;

            // Changer le joueur actif
            this.model.switchPlayer();

            // Mettre à jour l'interface pour afficher le joueur actif
            const activePlayer = this.model.getActivePlayer()
            this.view.updateActivePlayer(activePlayer);

            console.log(
                `C'est maintenant au tour des ${this.model.getActivePlayer()}`,
            );
            this.ajouterEvenement(
                `C'est maintenant au tour des ${this.model.getActivePlayer()}`,
            );
        } else {
            console.log("Aucune pièce jouée ce tour. Impossible de terminer.");
            this.ajouterEvenement(
                "Aucune pièce jouée ce tour. Impossible de terminer.",
            );
        }
    }

    // Fonction pour ajouter un événement dans l'afficheur
    ajouterEvenement(message) {
        const listeEvenements = document.getElementById("liste-evenements");
        const nouvelEvenement = document.createElement("li");
        nouvelEvenement.textContent = message;
        listeEvenements.appendChild(nouvelEvenement);

        // Défilement automatique vers le bas pour afficher le dernier événement
        listeEvenements.scrollTop = listeEvenements.scrollHeight;
    }
}

// Initialisation du jeu
document.addEventListener("DOMContentLoaded", () => {
    const model = new GameModel();
    const view = new GameView();
    const controller = new GameController(model, view);
});
