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
        this.addDirectionButtonsEventListeners()

        document.getElementById('pushButton').addEventListener('click', () => this.handlePush());
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
        // Bouton haut
        document.getElementById('btn-haut').addEventListener('click', () => {
            console.log("Direction reçue : haut");
            this.handleDirectionClick("haut");
        });

        // Bouton bas
        document.getElementById('btn-bas').addEventListener('click', () => {
            console.log("Direction reçue : bas");
            this.handleDirectionClick("bas");
        });

        // Bouton gauche
        document.getElementById('btn-gauche').addEventListener('click', () => {
            console.log("Direction reçue : gauche");
            this.handleDirectionClick("gauche");
        });

        // Bouton droite
        document.getElementById('btn-droite').addEventListener('click', () => {
            console.log("Direction reçue : droite");
            this.handleDirectionClick("droite");
        });

        document.getElementById("btn-gauche").addEventListener("click", () => this.tournerPieceBanc("gauche"));
        document.getElementById("btn-droite").addEventListener("click", () => this.tournerPieceBanc("droite"));
        document.getElementById("btn-haut").addEventListener("click", () => this.tournerPieceBanc("haut"));
        document.getElementById("btn-bas").addEventListener("click", () => this.tournerPieceBanc("bas"));

    }


    handlePush() {
        // Vérifier si une pièce est sélectionnée
        const piece = this.model.lastMovedPiece;
        if (!piece) {
            console.log("Aucune pièce sélectionnée pour la poussée.");
            this.view.showMessage("Aucune pièce sélectionnée pour la poussée.");
            return;
        }

        // Vérifier l'orientation actuelle de la pièce
        const orientation = piece.orientation;  // Par exemple, 0, 90, 180, 270
        if (orientation === undefined) {
            console.log("L'orientation de la pièce n'est pas définie.");
            this.view.showMessage("L'orientation de la pièce n'est pas définie.");
            return;
        }

        let direction;
        switch (orientation) {
            case 0:
                direction = "top";
                break;
            case 90:
                direction = "right";
                break;
            case 180:
                direction = "bottom";
                break;
            case 270:
                direction = "left";
                break;
            default:
                console.log("Orientation invalide pour la poussée.");
                this.view.showMessage("Orientation invalide pour la poussée.");
                return;
        }

        // Récupérer la position actuelle de la pièce
        const { row, col } = piece.position;
        let newPosition = { row, col };

        // Calculer la nouvelle position en fonction de la direction
        switch (direction) {
            case "top":
                newPosition.row -= 1;
                break;
            case "bottom":
                newPosition.row += 1;
                break;
            case "left":
                newPosition.col -= 1;
                break;
            case "right":
                newPosition.col += 1;
                break;
        }

        // Appeler la méthode pour déplacer la pièce ou pousser une autre pièce
        const moveSuccess = this.model.movePieceWithPush(piece.name, newPosition, direction);

        if (!moveSuccess) {
            console.log("Poussée échouée.");
            this.view.showMessage("Le rocher ne peut pas être poussé.");
        } else {
            console.log(`La pièce ${piece.name} a été poussée.`);
            this.view.showMessage(`La pièce ${piece.name} a été poussée avec succès.`);
        }
    }




    handleDirectionClick(direction) {
        // Vérifiez que la direction reçue est bien définie
        console.log("Direction reçue : " + direction);

        // Si la direction est reconnue, effectuez l'action appropriée
        if (["haut", "bas", "gauche", "droite"].includes(direction)) {
            this.selectedPiece.direction = direction;  // Exemple d'action avec la direction
            console.log("Direction validée : " + direction);
        } else {
            // Si la direction est inconnue, afficher un message d'erreur
            console.log("Direction inconnue : " + direction);
        }
    }

    handleBancClick(event, type) {
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

                // Permettre à l'utilisateur de tourner la pièce avant de la placer
                this.view.renderPieceRotation(this.selectedPiece);
            } else {
                console.log("Aucune pièce valide sélectionnée.");
            }
        }
    }

    tournerPieceBanc(direction) {
        if (!this.selectedPiece) {
            this.ajouterEvenement("Aucune pièce sélectionnée pour tourner.");
            return;
        }

        // Rotation de la pièce selon la direction
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

        // Mettre à jour l'orientation de la pièce sélectionnée sur le banc
        this.view.renderPieceRotation(this.selectedPiece);

        // Afficher un message de confirmation et réinitialiser l'action
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

        // Mettre à jour l'orientation de la pièce sélectionnée, mais cela ne touche pas les flèches
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

        // Vérifier si une pièce est sélectionnée et si l'action en cours est bien de placer la pièce
        if (this.currentAction !== "place") {
            this.ajouterEvenement("Vous devez d'abord sélectionner une pièce avant de la poser.");
            return;
        }

        // Vérifier si la case cliquée fait partie du plateau
        if (target.classList.contains("case")) {
            const row = parseInt(target.dataset.row);
            const col = parseInt(target.dataset.col);

            // Vérifier si la case est valide pour y poser la pièce
            if (!this.model.isEntryAllowed(row, col)) {
                this.ajouterEvenement("Cette case est interdite pour l'entrée.");
                return;
            }

            // Vérifier si la case est occupée par une autre pièce
            let currentRow = row;
            let currentCol = col;
            let pushedPiece = this.model.getPieceAt(currentRow, currentCol);

            // Si la case est occupée, on commence à pousser les pièces
            while (pushedPiece) {
                // Calcul de la nouvelle position selon la direction de la pièce
                const direction = this.selectedPiece.orientation;
                switch (direction) {
                    case "top":
                        currentRow -= 1;
                        break;
                    case "bottom":
                        currentRow += 1;
                        break;
                    case "left":
                        currentCol -= 1;
                        break;
                    case "right":
                        currentCol += 1;
                        break;
                    default:
                        console.log("Orientation invalide pour la poussée.");
                        return;
                }

                // Vérifier si la nouvelle case est dans les limites du plateau
                if (currentRow >= this.model.board.length || currentCol >= this.model.board[0].length || currentRow < 0 || currentCol < 0) {
                    this.ajouterEvenement("Impossible de pousser la pièce hors du plateau.");
                    return;
                }

                // Vérifier si la case suivante est vide
                let nextPiece = this.model.getPieceAt(currentRow, currentCol);
                if (!nextPiece) {
                    // Si la case suivante est vide, déplacer la pièce poussée
                    this.model.movePiece(pushedPiece.name, { row: currentRow, col: currentCol });
                    break; // Sortir de la boucle une fois la pièce poussée
                }

                // Si la case suivante est occupée, continuer à pousser
                pushedPiece = nextPiece;
            }

            // Si la case est vide après avoir poussé, on peut placer la nouvelle pièce
            if (this.selectedPiece) {
                this.model.movePiece(this.selectedPiece.name, { row, col });
                this.model.removePieceFromBanc(this.selectedPiece.name);
                this.view.renderBoard(this.model.board);
                this.view.renderElephantsBanc(this.model.bancElephants);
                this.view.renderRhinocerosBanc(this.model.bancRhinoceros);
                this.view.highlightLastMovedPiece(this.selectedPiece.name);
                this.ajouterEvenement(`Pièce ${this.selectedPiece.name} placée sur le plateau.`);
            }

            // Réinitialiser la sélection
            this.selectedPiece = null;
        }
    }



    terminerTour() {

        this.ajouterEvenement(`Tour terminé pour ${this.model.getActivePlayer()}.`);
        this.model.incrementTurn();
        this.selectedPiece = null;
        this.piecePlacedThisTurn = false;
        this.currentAction = "pick";
        this.model.switchPlayer();
        this.view.updateActivePlayer(this.model.getActivePlayer());
        this.ajouterEvenement(`C'est maintenant au tour des ${this.model.getActivePlayer()}.`);
    }
    handleMove(pieceName, targetRow, targetCol) {
        const piece = this.model.getPieceByName(pieceName);
        if (!piece) {
            console.log("La pièce n'existe pas.");
            return false;
        }

        const { row: currentRow, col: currentCol } = piece.position;

        // Vérifier si la case cible est valide
        if (this.model.isEntryAllowed(targetRow, targetCol)) {
            console.log("Déplacement ou poussée détectée.");

            // Vérifier si une poussée est nécessaire
            const pushedPiece = this.model.getPieceAt(targetRow, targetCol);
            if (pushedPiece) {
                // Tenter une poussée
                const success = this.model.pushPiece(currentRow, currentCol, targetRow, targetCol);
                if (!success) {
                    console.log("Poussée impossible.");
                    return false;
                }
            } else {
                // Déplacement normal, placer la pièce
                this.model.movePiece(pieceName, { row: targetRow, col: targetCol });
            }

            // Mettre à jour le tour et passer au joueur suivant
            this.model.incrementTurn();
            this.model.switchPlayer();

            // Informer la vue des changements
            this.view.updateBoard(this.model.board);
            return true;
        } else {
            console.log("Déplacement interdit.");
            return false;
        }
    }


}



document.addEventListener("DOMContentLoaded", () => {
    const model = new GameModel();
    const view = new GameView(model);
    const controller = new GameController(model, view);
});
