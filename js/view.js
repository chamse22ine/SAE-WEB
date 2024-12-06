class GameView {
    constructor(model) {
        this.plateauElement = document.getElementById("plateau");
        this.bancElephantsElement = document.getElementById("banc-elephants");
        this.bancRhinocerosElement = document.getElementById("banc-rhinoceros");
        this.model = model;
    }

    renderBoard(board) {
        this.plateauElement.innerHTML = "";
        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 5; col++) {
                const caseElement = document.createElement("div");
                caseElement.classList.add("case");

                const piece = board[row][col];
                if (piece) {
                    caseElement.style.backgroundImage = `url('../assets/images/pieces/${piece.type}.png')`;
                    caseElement.dataset.pieceName = piece.name;
                    caseElement.style.transform = `rotate(${piece.orientation || 0}deg)`;
                    caseElement.dataset.pieceName = piece.name;
                }

                if(!this.model.isEntryAllowed(row, col)) {
                    const croixElement = document.createElement("div");
                    croixElement.classList.add("croix");
                    croixElement.style.backgroundImage = `url('../assets/images/fleches/croix.png')`;
                    caseElement.appendChild(croixElement);
                }

                caseElement.dataset.row = row;
                caseElement.dataset.col = col;

                this.plateauElement.appendChild(caseElement);

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
        const previousHighlight = this.plateauElement.querySelector('.highlight');
        if (previousHighlight) {
            previousHighlight.classList.remove('highlight');
        }
        const newHighlight = this.plateauElement.querySelector(`[data-piece-name='${pieceName}']`);
        if (newHighlight) {
            newHighlight.classList.add('highlight');
        }
    }


}