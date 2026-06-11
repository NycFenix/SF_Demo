let terrainZ = 0;
let worldSpeed = 2; // Velocidade que o mundo passa


function drawCorneriaTerrain() {
  push()
  noStroke()
  fill(40,65, 90)

  translate(0, 180, 0);
  rotateX(PI/2.2)
}

function drawTerrain() {
  push();
  stroke(0, 230, 0); // verde para o background
  noFill();

  translate(0, 200, 0);
  rotateX(PI/2.3); // Deita o plano no chão

  // GRID
  translate(0, terrainZ, 0);

  for (let i = -10; i < 10; i++) {
    for (let j = -20; j < 5; j++) {
      rect(i*50, j*50, 50, 50) // Cria retangulos separados continuamente
     }
  }

  pop();

  // Move terreno pra frente

  terrainZ += worldSpeed;
  if (terrainZ >= 50) terrainZ = 0; // Reseta o loop
};



function setup() {
  createCanvas(800, 600, WEBGL);
}

function draw() {
  background(0);
  ambientLight(80);
  drawTerrain();
}
