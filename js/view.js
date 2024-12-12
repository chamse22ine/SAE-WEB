class GameView {
    constructor(model) {
        this.plateauElement = document.getElementById("plateau");
        this.bancElephantsElement = document.getElementById("banc-elephants");
        this.bancRhinocerosElement = document.getElementById("banc-rhinoceros");
        this.model = model;
    }
    renderBoard(board, highlightEmpty = false) {
        console.log("Rendu de l'état du plateau :", board);
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
                    caseElement.classList.add("case-libre");
                }
                this.plateauElement.appendChild(caseElement);
            }
        }
        console.log("Plateau rendu avec succès.");
    }

    highlightSelectablePieces(player) {
        const allPieces = [...this.bancElephantsElement.children, ...this.bancRhinocerosElement.children];
        allPieces.forEach(piece => piece.classList.remove('piece-selectable'));
        if (player === "elephant") {
            this.bancElephantsElement.childNodes.forEach(piece => {
                piece.classList.add('piece-selectable');
            });
        } else if (player === "rhinoceros") {
            this.bancRhinocerosElement.childNodes.forEach(piece => {
                piece.classList.add('piece-selectable');
            });
        }
    }

    showMessage(message) {
        console.log(message)
    }

    highlightCasesLibres() {
        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 5; col++) {
                const caseElement = this.plateauElement.querySelector(`[data-row='${row}'][data-col='${col}']`);
                if (caseElement) {
                    if (!this.model.getPieceAt(row, col)) {
                        caseElement.classList.add('case-libre');
                    } else {
                        caseElement.classList.remove('case-libre');
                    }
                }
            }
        }
    }

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

    highlightLastMovedPiece(pieceName) {
        // Supprime la surbrillance de la pièce précédemment mise en évidence, si elle existe
        const previousHighlight = this.plateauElement.querySelector('.highlight');
        if (previousHighlight) {
            previousHighlight.classList.remove('highlight');
        }

        // Ajoute la classe de surbrillance à la nouvelle pièce
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
        const playerDisplay = document.getElementById("nom-joueur-actif");
        if (playerDisplay) {
            playerDisplay.textContent = `${player}`;
        }
    }

}
