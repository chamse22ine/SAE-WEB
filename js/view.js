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
                    caseElement.dataset.pieceName = piece.name || "";
                    caseElement.style.transform = `rotate(${piece.orientation || 0}deg)`;

                    if (row === 0) {
                        this.addArrow(caseElement, "top");
                    }
                    if (row === 4) {
                        this.addArrow(caseElement, "bottom");
                    }
                    if (col === 0) {
                        this.addArrow(caseElement, "left");
                    }
                    if (col === 4) {
                        this.addArrow(caseElement, "right");
                    }
                } else if (!this.model.isEntryAllowed(row, col)) {
                    caseElement.style.backgroundImage = `url('../assets/images/fleches/croix.png')`;
                    caseElement.classList.add("case-interdite");
                }
                caseElement.dataset.row = row;
                caseElement.dataset.col = col;
                this.plateauElement.appendChild(caseElement);
            }
        }
    }

    addArrow(caseElement, direction) {
        const arrowElement = document.createElement("div");
        arrowElement.classList.add("arrow");
        arrowElement.style.backgroundImage = "url('../assets/images/fleches/arrow_push.png')";

        switch (direction) {
            case "top":
                arrowElement.style.top = "-10px";
                arrowElement.style.left = "50%";
                arrowElement.style.transform = "translate(-50%, -50%) rotate(90deg)";
                break;
            case "bottom":
                arrowElement.style.bottom = "10px";
                arrowElement.style.left = "50%";
                arrowElement.style.transform = "translate(-50%, 50%) rotate(-90deg)";
                break;
            case "left":
                arrowElement.style.top = "50%";
                arrowElement.style.left = "-10px";
                break;
            case "right":
                arrowElement.style.top = "50%";
                arrowElement.style.right = "-10px";
                arrowElement.style.transform = "translate(50%, -50%) rotate(-180deg)";
                break;
            default:
                break;
        }
        caseElement.appendChild(arrowElement);
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