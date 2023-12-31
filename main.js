import './style.css'

//1. iniciar el canva
const canvas= document.querySelector('canvas')
const context = canvas.getContext('2d')

const BLOCK_SIZE = 20; //tamaño de bloque
const BOARD_WIDTH = 14; //ancho contenedor
const BOARD_HEIGHT = 30; //alto de contenedor

canvas.width = BLOCK_SIZE * BOARD_WIDTH;
canvas.height = BLOCK_SIZE * BOARD_HEIGHT;

context.scale(BLOCK_SIZE, BLOCK_SIZE)

const board = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1],
]


// figuras
const piece = {
  position: { x: 5, y: 5 },
  shape: [
          [1, 1],
          [1, 1]
        ]
}


//2. game loop
let dropCounter = 0
let lastTime = 0


function update (time= 0)  {
  const deltaTime = time - lastTime
  lastTime = time

  dropCounter+= deltaTime

  if (dropCounter > 1000) {
    piece.position.y++ 
    dropCounter = 0
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
}

document.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft') { 
    piece.position.x--
    if (checkCollision()){
      piece.position.x++
    }
  }
  if (event.key === 'ArrowRight') { 
    piece.position.x++
    if (checkCollision()){
      piece.position.x--
    }
  }
  
  if (event.key === 'ArrowDown') { 
    piece.position.y++
    if (checkCollision()){
      piece.position.y--
      solidifyPieces()
      removeRows()
    }
  }
})

function checkCollision (){
  return piece.shape.find((row, y) => {
    return row.find((value,x)=> {
      return (
        value === 1&&
        board[y+ piece.position.y]?.[x+piece.position.x] !==0
      )
    })
  })
}

function solidifyPieces () {
  piece.shape.forEach((row,x) => {
    row.forEach((value, y) => {
      if(value===1) {
        board[y + piece.position.y] [x+piece.position.x]= 1
      }
    })
    
  })

  piece.position.x= 0
  piece.position.y= 0
}

function removeRows() {
  const rowsToRemove = []

  board.forEach((row, y) =>{
    if (row.every(value => value === 1)) {
      rowsToRemove.push(y)
    }
  })

  rowsToRemove.forEach(y => {
    board.splice(y, 1)
    const newRow = Array(BOARD_WIDTH).fill(0)
    board.unshift(newRow)
  })
}



update ()



