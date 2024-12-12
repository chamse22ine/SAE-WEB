class GameView {
    constructor(model) {
        this.plateauElement = document.getElementById("plateau");
        this.bancElephantsElement = document.getElementById("banc-elephants");
        this.bancRhinocerosElement = document.getElementById("banc-rhinoceros");
        this.model = model;
    }

    // Affiche l'état du plateau
    renderBoard(board, highlightEmpty = false) {
        console.log("Rendu de l'état du plateau :", board);

        // Réinitialise l'affichage du plateau
        this.plateauElement.innerHTML = "";

        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 5; col++) {
                const caseElement = document.createElement("div");
                caseElement.classList.add("case");
                caseElement.dataset.row = row;
                caseElement.dataset.col = col;

                const piece = board[row][col];

                if (piece) {
                    caseElement.style.backgroundImage = `url('../assets/images/pieces/${piece.type}.png')`;
                    caseElement.dataset.pieceName = piece.name || "";
                    caseElement.style.transform = `rotate(${piece.orientation || 0}deg)`;
                } else if (!this.model.isEntryAllowed(row, col)) {
                    caseElement.style.backgroundImage = `url('../assets/images/fleches/croix.png')`;
                    caseElement.classList.add("case-interdite");
                } else if (highlightEmpty) {
                    // Ajout de la classe "case-libre" si l'option highlightEmpty est activée
                    caseElement.classList.add("case-libre");
                }

                this.plateauElement.appendChild(caseElement);
            }
        }
        console.log("Plateau rendu avec succès.");
    }




    showMessage(message) {
        console.log(message)
    }
    highlightCasesLibres() {
        // Parcourir toutes les cases du plateau
        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 5; col++) {
                const caseElement = this.plateauElement.querySelector(`[data-row='${row}'][data-col='${col}']`);
                if (caseElement) {
                    // Vérifier si la case est vide
                    if (!this.model.getPieceAt(row, col)) {
                        caseElement.classList.add('case-libre'); // Ajouter une classe pour surbrillance
                    } else {
                        caseElement.classList.remove('case-libre'); // Retirer la classe si la case n'est pas vide
                    }
                }
            }
        }
    }


    // Ajoute une flèche à une case
    addArrow(caseElement, direction) {
        const arrowElement = document.createElement("div");
        arrowElement.classList.add("arrow");
        arrowElement.style.backgroundImage = "url('../assets/images/fleches/arrow_push.png')";
        arrowElement.dataset.direction = direction;

        // Position de la flèche
        switch (direction) {
            case "haut":
                arrowElement.style.top = "-10px";
                arrowElement.style.left = "50%";
                arrowElement.style.transform = "translate(-50%, -50%) rotate(90deg)";
                break;
            case "bas":
                arrowElement.style.bottom = "10px";
                arrowElement.style.left = "50%";
                arrowElement.style.transform = "translate(-50%, 50%) rotate(-90deg)";
                break;
            case "gauche":
                arrowElement.style.top = "50%";
                arrowElement.style.left = "-10px";
                arrowElement.style.transform = "translate(-50%, -50%) rotate(0deg)";
                break;
            case "droite":
                arrowElement.style.top = "50%";
                arrowElement.style.right = "-10px";
                arrowElement.style.transform = "translate(50%, -50%) rotate(180deg)";
                break;
        }
        caseElement.appendChild(arrowElement);
    }

    // Affiche les pièces dans le banc des éléphants
    renderElephantsBanc(bancElephants) {
        this.bancElephantsElement.innerHTML = "";

        bancElephants.forEach(elephant => {
            const caseElement = document.createElement("div");
            caseElement.classList.add("case");
            caseElement.style.backgroundImage = `url('../assets/images/pieces/${elephant.type}.png')`;
            caseElement.dataset.pieceName = elephant.name;

            this.bancElephantsElement.appendChild(caseElement);
        });
    }


    // Affiche les pièces dans le banc des rhinocéros
    renderRhinocerosBanc(bancRhinoceros) {
        this.bancRhinocerosElement.innerHTML = "";

        bancRhinoceros.forEach(rhinoceros => {
            const caseElement = document.createElement("div");
            caseElement.classList.add("case");
            caseElement.style.backgroundImage = `url('../assets/images/pieces/${rhinoceros.type}.png')`;
            caseElement.dataset.pieceName = rhinoceros.name;

            this.bancRhinocerosElement.appendChild(caseElement);
        });
    }

    // Met en surbrillance la dernière pièce déplacée
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

    renderPieceRotation(piece) {
        if (this.bancElephantsElement) {
            const pieceElement = this.bancElephantsElement.querySelector(`[data-piece-name='${piece.name}']`);
            if (pieceElement) {
                pieceElement.style.transform = `rotate(${piece.orientation}deg)`;
            }
        }
        if (this.bancRhinocerosElement) {
            const pieceElementRhinoceros = this.bancRhinocerosElement.querySelector(`[data-piece-name='${piece.name}']`);
            if (pieceElementRhinoceros) {
                pieceElementRhinoceros.style.transform = `rotate(${piece.orientation}deg)`;
            }
        }
    }

    updateActivePlayer(player) {
        console.log(`Joueur actif : ${player}`);
        const playerDisplay = document.getElementById("active-player");
        if (playerDisplay) {
            playerDisplay.textContent = `Joueur actif : ${player}`;
        }
    }

}
