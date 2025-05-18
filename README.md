# 🐘 Siam – Web Board Game

**Siam** is a strategic 2-player board game involving elephants, rhinoceroses, and rocks. This web application is a dynamic implementation of the game, built using **vanilla JavaScript**, **HTML5**, and **CSS**.

## 📋 Game Overview

Siam is a tactical game where players control elephants or rhinoceroses and try to push a rock off the board to win. This project faithfully recreates the physical game experience in the browser.

## 🎮 Features

- Dynamic display of the Siam board in its initial state
- Turn-based gameplay with clear player indicators
- Real-time piece movement and interaction
- Highlighting of:
  - Selectable pieces
  - Valid move destinations
  - Last moved piece
- Reserve management for each player
- Win condition detection and endgame handling
- Ability to restart the game with a reset button

## 🛠️ Technologies Used

- JavaScript (ES6+)
- HTML5
- CSS3
- Object-oriented programming and MVC structure

## 📐 Project Architecture

siam-game/
├── index.html      # Main game page
├── css/
│   └── style.css   # Custom styles
├── js/
│   ├── model.js    # Game logic and rules
│   ├── view.js     # UI rendering
│   └── controller.js # Game interaction and flow
└── img/            # Game pieces and board graphics

## 🎨 Visual Resources

The board and game pieces graphical representations are inspired by Biboun's artwork:
[http://www.biboun.com/portfolio/siam/](http://www.biboun.com/portfolio/siam/)

## 🎯 Game Rules

1. **Objective**: Push a rock off the board to win
2. **Turn Actions**: On each turn, a player can:
   - Introduce a new piece onto the board
   - Move an existing piece
   - Change a piece's orientation
3. **Pushing**: Pieces can push other pieces if:
   - They are oriented in the pushing direction
   - The total pushing force exceeds the resistance

## 🚀 Installation and Setup

1. Clone this repository
2. Open `index.html` in your browser
3. Enjoy the game!


## 📜 License

This project is intended for learning and demonstration purposes. All game graphics remain the property of their original creators.

---

