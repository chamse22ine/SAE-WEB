class GameController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.selectedPiece = null; // Pièce sélectionnée
        this.pieceDejaPlacee = null; // Pièce placée pour le tour en cours
        this.currentPlayer = "rhino"; // Le joueur Rhino commence

        // Rendu initial
        this.view.renderBoard(this.model.board);
        this.view.renderElephantsBanc(this.model.bancElephants);
        this.view.renderRhinocerosBanc(this.model.bancRhinoceros);

        // Attache des gestionnaires d'événements
        this.addEventListeners();

        // Met à jour l'indicateur visuel du joueur actif
        this.updateJoueurActif();
    }


    addEventListeners() {
        // Gestion des clics sur le banc des éléphants
        this.view.bancElephantsElement.addEventListener('click', (event) => this.handleBancClick(event, 'elephant'));

        // Gestion des clics sur le banc des rhinocéros
        this.view.bancRhinocerosElement.addEventListener('click', (event) => this.handleBancClick(event, 'rhinoceros'));

        // Gestion des clics sur le plateau
        this.view.plateauElement.addEventListener('click', (event) => this.handlePlateauClick(event));

        // Gestion des clics sur les boutons de direction
        document.getElementById('btn-gauche').addEventListener('click', () => this.tournerPiece('left'));
        document.getElementById('btn-droite').addEventListener('click', () => this.tournerPiece('right'));
        document.getElementById('btn-haut').addEventListener('click', () => this.tournerPiece('up'));
        document.getElementById('btn-bas').addEventListener('click', () => this.tournerPiece('down'));
        document.getElementById('btn-terminer-tour').addEventListener('click', () => this.terminerTour());

    }

    tournerPiece(direction) {
        if (!this.selectedPiece) {
            console.log("Aucune pièce sélectionnée pour tourner");
            this.ajouterEvenement("Aucune pièce sélectionnée pour tourner");
            return;
        }

        // Détermine l'angle de rotation en fonction de la direction
        switch (direction) {
            case 'left':
                this.selectedPiece.orientation = (this.selectedPiece.orientation - 90 + 360) % 360;
                break;
            case 'right':
                this.selectedPiece.orientation = (this.selectedPiece.orientation + 90) % 360;
                break;
            case 'up':
                this.selectedPiece.orientation = 0;
                break;
            case 'down':
                this.selectedPiece.orientation = 180;
                break;
        }

        // Applique la rotation à l'élément de la pièce sélectionnée sur le plateau
        const pieceElement = this.view.plateauElement.querySelector(`[data-piece-name='${this.selectedPiece.name}']`);
        if (pieceElement) {
            pieceElement.style.transform = `rotate(${this.selectedPiece.orientation}deg)`;
        }

        console.log(`Pièce ${this.selectedPiece.name} tournée vers ${direction}`);
        this.ajouterEvenement(`Pièce ${this.selectedPiece.name} tournée vers ${direction}`);
    }



    handleBancClick(event, type) {
        const target = event.target;

        if (target.classList.contains('case')) {
            const pieceName = target.dataset.pieceName;
            if (pieceName) {
                const piece = this.model.getPieceByName(pieceName);

                // Vérifie que la pièce appartient au joueur actif
                if ((this.currentPlayer === "rhino" && piece.type.startsWith("rhino")) ||
                    (this.currentPlayer === "éléphant" && piece.type.startsWith("éléphant"))) {
                    this.selectedPiece = piece; // Met à jour la pièce sélectionnée
                    console.log(`Pièce sélectionnée : ${this.selectedPiece.name}`);
                    this.ajouterEvenement(`Sélection de la pièce : ${this.selectedPiece.name}`);
                } else {
                    console.log("Ce n'est pas votre tour !");
                    this.ajouterEvenement("Ce n'est pas votre tour !");
                }
            }
        }
    }



    handlePlateauClick(event) {
        const target = event.target;

        if (!this.selectedPiece) {
            console.log("Aucune pièce sélectionnée");
            this.ajouterEvenement("Aucune pièce sélectionnée");
            return;
        }

        // Vérifie si la pièce appartient au joueur actif
        if ((this.currentPlayer === "rhino" && this.selectedPiece.type.startsWith("rhino")) ||
            (this.currentPlayer === "éléphant" && this.selectedPiece.type.startsWith("éléphant"))) {
            if (target.classList.contains('case')) {
                const row = parseInt(target.dataset.row);
                const col = parseInt(target.dataset.col);

                // Vérifie si la case est vide
                if (!this.model.getPieceAt(row, col)) {
                    this.model.movePiece(this.selectedPiece.name, { row, col });
                    this.model.removePieceFromBanc(this.selectedPiece.name);

                    // Met à jour l'affichage
                    this.view.renderBoard(this.model.board);
                    this.view.highlightLastMovedPiece(this.selectedPiece.name);
                    this.view.renderElephantsBanc(this.model.bancElephants);
                    this.view.renderRhinocerosBanc(this.model.bancRhinoceros);

                    this.ajouterEvenement(`Pièce ${this.selectedPiece.name} placée à la position (${row}, ${col})`);
                    this.selectedPiece = null;
                } else {
                    console.log("Case déjà occupée");
                    this.ajouterEvenement("Case déjà occupée");
                }
            }
        } else {
            console.log("Ce n'est pas votre tour !");
            this.ajouterEvenement("Ce n'est pas votre tour !");
        }
    }



    terminerTour() {
        if (this.pieceDejaPlacee) {
            console.log(`Tour terminé pour la pièce ${this.pieceDejaPlacee.name}`);
            this.ajouterEvenement(`Tour terminé pour la pièce ${this.pieceDejaPlacee.name}`);
            this.pieceDejaPlacee = null; // Réinitialise la pièce placée
        } else {
            console.log("Aucune pièce en jeu à terminer");
            this.ajouterEvenement("Aucune pièce en jeu à terminer");
        }

        // Alterne le joueur actif
        this.currentPlayer = this.currentPlayer === "rhino" ? "elephant" : "rhino";
        this.ajouterEvenement(`C'est maintenant au tour de ${this.currentPlayer}`);

        // Met à jour l'indicateur visuel
        this.updateJoueurActif();
    }

    updateJoueurActif() {
        const joueurActifElement = document.getElementById('nom-joueur-actif');
        joueurActifElement.textContent = this.currentPlayer === "rhino" ? "Rhino" : "Elephant";
    }


    // Fonction pour ajouter un événement dans l'afficheur
    ajouterEvenement(message) {
        const listeEvenements = document.getElementById('liste-evenements');
        const nouvelEvenement = document.createElement('li');
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
