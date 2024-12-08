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
        this.view.plateauElement.addEventListener("click", (event) => {
            if (event.target.classList.contains("arrow")) {
                this.handleArrowClick(event);
            }
        });
    }

    addDirectionButtonsEventListeners() {
        // Bouton haut
        document.getElementById('btn-haut').addEventListener('click', () => {
            console.log("Direction reçue : haut"); // Debug
            this.handleDirectionClick.bind(this,"haut");
        });

        // Bouton bas
        document.getElementById('btn-bas').addEventListener('click', () => {
            console.log("Direction reçue : bas"); // Debug
            this.handleDirectionClick.bind(this,"bas");
        });

        // Bouton gauche
        document.getElementById('btn-gauche').addEventListener('click', () => {
            console.log("Direction reçue : gauche"); // Debug
            this.handleDirectionClick.bind(this,"gauche");
        });

        // Bouton droite
        document.getElementById('btn-droite').addEventListener('click', () => {
            console.log("Direction reçue : droite"); // Debug
            this.handleDirectionClick.bind(this,"droite");
        });
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
        const orientation = piece.orientation;
        if (!orientation) {
            console.log("L'orientation de la pièce n'est pas définie.");
            this.view.showMessage("L'orientation de la pièce n'est pas définie.");
            return;
        }

        // Récupérer la position actuelle de la pièce
        const { row, col } = piece.position;
        let newPosition = { row, col };

        // Calculer la nouvelle position en fonction de l'orientation de la pièce
        switch (orientation) {
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
            default:
                console.log("Orientation inconnue : ", orientation);
                return;
        }

        // Appeler la méthode pour déplacer la pièce ou pousser une autre pièce
        const moveSuccess = this.model.movePieceWithPush(piece.name, newPosition, orientation);

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



    handleArrowClick(event) {
        if (!this.selectedPiece) {
            this.ajouterEvenement("Sélectionnez une pièce avant d'utiliser une flèche.");
            return;
        }

        const arrowElement = event.target;
        const direction = arrowElement.dataset.direction; // direction fixe de la flèche
        const caseElement = arrowElement.parentElement;
        const row = parseInt(caseElement.dataset.row);
        const col = parseInt(caseElement.dataset.col);

        // Calculer la nouvelle position
        let newRow = row, newCol = col;
        let rowDiff = 0, colDiff = 0;

        // Calculer la direction du mouvement
        switch (direction) {
            case "top":
                newRow = row - 1;
                rowDiff = -1;
                break;
            case "bottom":
                newRow = row + 1;
                rowDiff = 1;
                break;
            case "left":
                newCol = col - 1;
                colDiff = -1;
                break;
            case "right":
                newCol = col + 1;
                colDiff = 1;
                break;
        }

        // Vérification si la case suivante est valide
        if (newRow < 0 || newRow >= 5 || newCol < 0 || newCol >= 5) {
            this.ajouterEvenement("Impossible de pousser hors du plateau.");
            return;
        }

        // Vérifier si la case suivante est occupée par une autre pièce (on veut pousser une pièce)
        let currentRow = newRow;
        let currentCol = newCol;
        let pushedPiece = this.model.getPieceAt(currentRow, currentCol);

        // Si la case est vide, déplacer la pièce sélectionnée (pas de poussée)
        if (!pushedPiece) {
            this.model.movePiece(this.selectedPiece.name, { row: newRow, col: newCol });
            this.view.renderBoard(this.model.board);
            this.view.renderElephantsBanc(this.model.bancElephants);
            this.view.renderRhinocerosBanc(this.model.bancRhinoceros);
            this.ajouterEvenement(`Pièce ${this.selectedPiece.name} déplacée en ${direction}.`);
            this.selectedPiece = null;
            return; // Fin de la fonction si la case est libre
        }

        // Si la case est occupée par une pièce, commencer la poussée
        let moveCount = 0;
        const maxMoves = 10000;

        // Boucle pour pousser la pièce tant qu'il y a une autre pièce à déplacer
        while (pushedPiece && moveCount < maxMoves) {
            // Calcul de la nouvelle position pour pousser la pièce
            const nextRow = currentRow + rowDiff; // Calcul de la nouvelle ligne
            const nextCol = currentCol + colDiff; // Calcul de la nouvelle colonne

            // Vérification si la case suivante est encore dans les limites du plateau
            if (nextRow < 0 || nextRow >= 5 || nextCol < 0 || nextCol >= 5) {
                console.log("La pièce ne peut pas sortir du plateau.");
                this.ajouterEvenement("La pièce poussée ne peut pas sortir du plateau.");
                return;
            }

            // Vérification si la case suivante est occupée ou libre
            pushedPiece = this.model.getPieceAt(nextRow, nextCol);
            if (!pushedPiece) {
                console.log(`Case libre atteinte en (${nextRow}, ${nextCol}). Fin du mouvement.`);
                break; // Si la case est libre, arrêter la boucle
            }

            // Déplacer la pièce poussée
            this.model.movePiece(pushedPiece.name, { row: nextRow, col: nextCol });

            // Mettre à jour la position de la pièce
            currentRow = nextRow;
            currentCol = nextCol;

            moveCount++; // Incrémenter le compteur pour éviter une boucle infinie
        }

        // Vérifier si nous avons dépassé la limite de déplacements
        if (moveCount >= maxMoves) {
            this.ajouterEvenement("Limite de déplacement atteinte, boucle infinie possible.");
            return;
        }

        // Déplacer la pièce sélectionnée
        this.model.movePiece(this.selectedPiece.name, { row: newRow, col: newCol });

        // Rafraîchir l'affichage du plateau
        this.view.renderBoard(this.model.board);
        this.view.renderElephantsBanc(this.model.bancElephants);
        this.view.renderRhinocerosBanc(this.model.bancRhinoceros);

        // Ajouter un message d'événement pour indiquer que le mouvement a eu lieu
        this.ajouterEvenement(`Pièce ${this.selectedPiece.name} déplacée et poussée en ${direction}.`);

        // Réinitialiser la sélection
        this.selectedPiece = null;
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
            }


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


}




document.addEventListener("DOMContentLoaded", () => {
    const model = new GameModel();
    const view = new GameView(model);
    const controller = new GameController(model, view);
});
