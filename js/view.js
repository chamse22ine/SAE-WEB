class GameView {
    constructor() {
        this.plateauElement = document.getElementById("plateau");
        this.bancElephantsElement = document.getElementById("banc-elephants");
        this.bancRhinocerosElement = document.getElementById("banc-rhinoceros");
    }

    renderBoard(board) {
        this.plateauElement.innerHTML = ""; // Vide le plateau

        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 5; col++) {
                const caseElement = document.createElement("div");
                caseElement.classList.add("case");

                const piece = board[row][col];
                if (piece) {
                    caseElement.style.backgroundImage = `url('../assets/images/pieces/${piece.type}.png')`;
                    caseElement.dataset.pieceName = piece.name;
                }

                caseElement.dataset.row = row;
                caseElement.dataset.col = col;

                this.plateauElement.appendChild(caseElement);
            }
        }
    }

    renderElephantsBanc(bancElephants) {
        this.bancElephantsElement.innerHTML = ""; // Vide le banc des éléphants

        bancElephants.forEach(elephant => {
            const caseElement = document.createElement("div");
            caseElement.classList.add("case");
            caseElement.style.backgroundImage = `url('../assets/images/pieces/${elephant.type}.png')`;
            caseElement.dataset.pieceName = elephant.name;

            this.bancElephantsElement.appendChild(caseElement);
        });
    }

    renderRhinocerosBanc(bancRhinoceros) {
        this.bancRhinocerosElement.innerHTML = ""; // Vide le banc des rhinocéros

        bancRhinoceros.forEach(rhinoceros => {
            const caseElement = document.createElement("div");
            caseElement.classList.add("case");
            caseElement.style.backgroundImage = `url('../assets/images/pieces/${rhinoceros.type}.png')`;
            caseElement.dataset.pieceName = rhinoceros.name;

            this.bancRhinocerosElement.appendChild(caseElement);
        });
    }
    highlightLastMovedPiece(pieceName) {
        // Supprime l'ancienne mise en évidence
        const previousHighlight = this.plateauElement.querySelector('.highlight');
        if (previousHighlight) {
            previousHighlight.classList.remove('highlight');
        }

        // Met en évidence la nouvelle pièce
        const newHighlight = this.plateauElement.querySelector(`[data-piece-name='${pieceName}']`);
        if (newHighlight) {
            newHighlight.classList.add('highlight');
        }
    }


}
