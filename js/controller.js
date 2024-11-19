class GameController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.selectedPiece = null; // Stocke la pièce sélectionnée
    this.pieceDejaPlacee = null; // Pièce placée pour le tour en cours

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
    if (!this.selectedPiece) {
      console.log("Aucune pièce sélectionnée");
      this.ajouterEvenement("Aucune pièce sélectionnée");
      return;
    }

    if (target.classList.contains("case")) {
      const row = parseInt(target.dataset.row);
      const col = parseInt(target.dataset.col);

      // Vérifie si la case est vide
      if (!this.model.getPieceAt(row, col)) {
        // Met à jour la position de la pièce dans le modèle
        this.model.movePiece(this.selectedPiece.name, { row, col });

        // Supprime la pièce du banc (fonctionne pour les éléphants et les rhinocéros)
        this.model.removePieceFromBanc(this.selectedPiece.name);

        // Met à jour l'affichage
        this.view.renderBoard(this.model.board);

        // Met en évidence la dernière pièce déplacée
        this.view.highlightLastMovedPiece(this.selectedPiece.name);

        // Met à jour l'affichage des bancs
        this.view.renderElephantsBanc(this.model.bancElephants);
        this.view.renderRhinocerosBanc(this.model.bancRhinoceros);

        // Ajoute un événement dans l'afficheur
        this.ajouterEvenement(
          `Pièce ${this.selectedPiece.name} placée à la position (${row}, ${col})`,
        );

        // Définissez la pièce comme sélectionnée pour permettre la rotation ultérieure
        this.selectedPiece = this.model.getPieceByName(this.selectedPiece.name);
      } else {
        console.log("Case déjà occupée");
        this.ajouterEvenement("Case déjà occupée");
      }
    }
  }

  terminerTour() {
    if (this.pieceDejaPlacee) {
      console.log(`Tour terminé pour la pièce ${this.pieceDejaPlacee.name}`);
      this.ajouterEvenement(
        `Tour terminé pour la pièce ${this.pieceDejaPlacee.name}`,
      );
      this.pieceDejaPlacee = null; // Réinitialise la pièce placée
    } else {
      console.log("Aucune pièce en jeu à terminer");
      this.ajouterEvenement("Aucune pièce en jeu à terminer");
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
