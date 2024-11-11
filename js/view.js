document.addEventListener('DOMContentLoaded', function() {
    const plateau = document.getElementById('plateau');
    const nb_ligne = 5; // nombre de lignes
    const nb_col = 5;   // nombre de colonnes

    for (let i = 0; i < nb_ligne; i++) {
        for (let j = 0; j < nb_col; j++) {
            const caseElement = document.createElement('div');
            caseElement.classList.add('case');
            plateau.append(caseElement);
        }
    }
});