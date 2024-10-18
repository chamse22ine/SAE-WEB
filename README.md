# Siam
Cahier des charges
L'objectif est de créer une page web dynamique qui permet de jouer une partie du jeu Siam.

Règles du jeu
https://090c4d6b-0b5d-44fc-8506-c286659df2fd.filesusr.com/ugd/92ca7d_21a266c24b9a47acb695d974b94541b5.pdf

ressources graphiques
http://www.biboun.com/portfolio/siam/


Fonctionnement de l'application
Jeu Siam
la page du jeu:

affiche le plateau dans sa position de départ
indique le joueur dont c'est le tour
affiche le nombre de pièces en réserve pour chaque joueur
met en évidence la dernière pièce à avoir été déplacée
propose au joueur actif de sélectionner une pièce du plateau ou de la réserve (toutes mises en évidence)
une fois la pièce sélectionnée, lui propose de cliquer sur une des zones de destination possibles et mises en évidence, ou d'annuler la sélection initiale pour revenir à l'étape précédente. met à jour la position et passe la main à l'adversaire
ajouter un bouton qui permet de réinitialiser le plateau et de recommencer la partie
il faut bien sûr tester les conditions de victoire et détecter la fin de partie!



Quelques conseils
le plateau est constitué d'une div avec un positionnement relatif et l'image du plateau en image de fond
les zones cliquables sont des divs positionnées en absolute par rapport au plateau. elles peuvent contenir l'image des pièces, imbriquées dans la div ou en image de fond, et posséder une ou plusieurs classes qui permettent d'identifier ces zones. exemple:
.clCliquable {border: green dashed 2px; border-radius: 4px;}
.clSurvol {border: yellow dashed 2px; border-radius: 4px;}
.clSelection {border: red dashed 2px; border-radius: 4px;}
pas de tableau html pour l'affichage du plateau, ce n'est pas fait pour ça!
Tout est géré en javascript dans la même page, on ne sauvegarde rien, il faut donc éviter de rafraîchir la page sinon on perdra la partie en cours.
lisez bien les règles du jeu, au besoin faites quelques parties en ligne (boardgamearena.com); l'implémentation correcte des règles fera partie des éléments évalués.
Contraintes techniques
L'application devra utiliser les technologies suivantes :

Modele MVC: structurer l'application pour bien séparer les parties Modele - Vue - Controleurs
utilisations de classes d'objets pour les éléments constitutifs du jeu
JavaScript natif + HTML5 + CSS (bootstrap autorisé)
Toute utilisation d'une bibliothèque/API/framework annexe devra être validée au préalable par l'enseignant (ou si vous voulez gagner du temps: la réponse est non)

Infos pratiques
Date de rendu du projet : 13 décembre, sous forme d'un zip comprenant la page et toutes les ressources nécessaires (scripts, images)
Projet à réaliser en binôme, sauf autorisation explicite
composition des binômes à me communiquer par mail avant le 31 octobre
