import './style.css'

//1. iniciar el canva
const canvas= document.querySelector('canvas')
const context = canvas.getContext('2d')
const $score = document.querySelector ('span')

const BLOCK_SIZE = 20; //tamaño de bloque
const BOARD_WIDTH = 14; //ancho contenedor
const BOARD_HEIGHT = 30; //alto de contenedor

let score = 0
let dropTimeBase = 1000;

canvas.width = BLOCK_SIZE * BOARD_WIDTH;
canvas.height = BLOCK_SIZE * BOARD_HEIGHT;

context.scale(BLOCK_SIZE, BLOCK_SIZE)

const board = createBoard(BOARD_WIDTH, BOARD_HEIGHT)

function createBoard (width, height) {
  return Array(height).fill().map(() => Array(width).fill(0))
}

const piece = {
  position: { x: 5, y: 5 },
  shape: [
    [1, 1],
    [1, 1]
  ]
}

//pieces random
const PIECES = [
  [
    [1,1],
    [1,1]
  ],
  [
    [1,1,1,1]
  ],
  [
    [0,1,0],
    [1,1,1]
  ],
  [
    [0,1,1],
    [1,1,0]
  ],
  [
    [1,1,0],
    [0,1,1]
  ],
  [
    [1,0],
    [1,0],
    [1,1]
  ],
  [
    [0,1],
    [0,1],
    [1,1]
  ]
]

//2. game loop
let dropCounter = 0
let lastTime = 0


function update (time= 0)  {
  const deltaTime = time - lastTime
  lastTime = time

  dropCounter+= deltaTime

  // Ajusta el tiempo de caída basado en el score
  let dropTime = dropTimeBase - Math.floor(score / 10) * 50;
  dropTime = Math.max(dropTime, 100); // Establece un límite mínimo para dropTime

  if (dropCounter > dropTime) {
    piece.position.y++ 
    dropCounter = 0

    if (checkCollision()) {
      piece.position.y--
      solidifyPieces()
      removeRows()
    }
  }

  draw();
  window.requestAnimationFrame(update)
}



function draw ()  {
  context.fillStyle = '#000'; //color
  context.fillRect(0, 0, canvas.width, canvas.height) // dibuja un rectangulo desde el punto 0, 0 en el ancho y largo del canva

  board.forEach((row, y) => {
    row.forEach((value, x ) => {
      if (value=== 1){
        context.fillStyle ='yellow';
        context.fillRect (x, y, 1, 1)
      }
    })
  })

  piece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value) {
        context.fillStyle = 'red';
        context.fillRect(x + piece.position.x, y + piece.position.y, 1, 1);
      }
    })
  })

  $score.innerText =score 

}

// 1. Extracción de funciones

function moveLeft() {
  piece.position.x--;
  if (checkCollision()) {
      piece.position.x++;
  }
}

function moveRight() {
  piece.position.x++;
  if (checkCollision()) {
      piece.position.x--;
  }
}

function moveDown() {
  piece.position.y++;
  if (checkCollision()) {
      piece.position.y--;
      solidifyPieces();
      removeRows();
  }
}

function rotatePiece() {
  const rotated = piece.shape[0].map((_, index) => piece.shape.map(row => row[index])).reverse();
  const prevShape = piece.shape;
  piece.shape = rotated;
  if (checkCollision()) {
      piece.shape = prevShape;
  }
}

// 2. Mapeo de acciones

const ACTIONS = {
  'ArrowLeft': moveLeft,
  'ArrowRight': moveRight,
  'ArrowDown': moveDown,
  'ArrowUp': rotatePiece
};

document.addEventListener('keydown', event => {
  event.preventDefault();

  const action = ACTIONS[event.key];
  if (action) {
      action();
  }
});

function checkCollision () {
  return piece.shape.find((row, y) => {
    return row.find((value, x) => {
      return (
        value !== 0 &&
        board[y + piece.position.y]?.[x + piece.position.x] !==0
      )
    })
  })
}

function solidifyPieces () {
  piece.shape.forEach((row,y) => {
    row.forEach((value, x) => {
      if(value===1) {
        board[y + piece.position.y] [x + piece.position.x]= 1
      }
    })
    
  })


//reset position
  piece.position.x= 0
  piece.position.y= 0

  //get random piece

  piece.position.y= 0 
  piece.shape = PIECES[Math.floor(Math.random() * PIECES.length)]

  if (checkCollision()) {
    gameOver();
}

}

function removeRows() {
  const rowsToRemove = [];

  board.forEach((row, y) => {
    if (row.every(value => value === 1)) {
      rowsToRemove.push(y);
    }
  });

  rowsToRemove.forEach(y => {
    // Antes de eliminar la fila, añadimos el efecto
    addBreakingEffect(y);

    board.splice(y, 1);
    const newRow = Array(BOARD_WIDTH).fill(0);
    board.unshift(newRow);
    score += 10;
  });
}

function addBreakingEffect(row) {
  const canvasRect = canvas.getBoundingClientRect();

  for (let x = 0; x < BOARD_WIDTH; x++) {
    const cube = document.createElement("div");
    cube.classList.add("cube");
    cube.style.left = `${canvasRect.left + x * BLOCK_SIZE}px`;  // Usamos canvasRect.left para ajustar la posición x
    cube.style.top = `${canvasRect.top + row * BLOCK_SIZE}px`;   // Usamos canvasRect.top para ajustar la posición y
    cube.style.background = "yellow";
    cube.style.animationDelay = `${Math.random() * 0.5}s`;
    document.body.appendChild(cube);
    
    setTimeout(() => {
      document.body.removeChild(cube);
    }, 1000);
  }
}



function gameOver() {
  const userName = prompt("Game Over!!\nPor favor ingresa tu nombre:", "Jugador");

  if (userName) {
      const highScores = JSON.parse(localStorage.getItem("highScores")) || [];
      highScores.push({ name: userName, score });

      //10 mejores
      highScores.sort((a, b) => b.score - a.score);
      highScores.splice(10);

      localStorage.setItem("highScores", JSON.stringify(highScores));
      showHighScores();
  }

  board.forEach((row) => row.fill(0));
  score = 0;
}

function showHighScores() {
  const highScores = JSON.parse(localStorage.getItem("highScores")) || [];
  
  const highScoresDiv = document.getElementById("highScoresList");

  let scoreList = '<ul>';
  highScores.forEach(entry => {
      scoreList += `<li>${entry.name}: ${entry.score}</li>`;
  });
  scoreList += '</ul>';

  highScoresDiv.innerHTML = scoreList;
}

update ()



