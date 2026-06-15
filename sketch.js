// Configurações do Jogo
let paddle;
let ball;
let bricks = [];
let rows = 5;
let cols = 10;
let score = 0;
let gameOver = false;
let win = false;
let gameStarted = false;

function setup() {
  createCanvas(800, 600);
  showStartScreen();
  resetGame();
}

function draw() {
  background(20);

  // Mostrar Pontuação
  fill(255);
  textSize(20);
  textAlign(LEFT, TOP);
  text("Pontos: " + score, 20, 20);

  if (!gameStarted) {
    showStartScreen("Preparado? Pressione ESPAÇO para iniciar!", color(255, 255, 255));
    return;
  }

  if (gameOver) {
    showEndScreen("FIM DE JOGO", color(255, 50, 50));
    return;
  }

  if (win) {
    showEndScreen("VOCÊ VENCEU!", color(50, 255, 50));
    return;
  }

  // Atualizar e Mostrar a Raquete
  paddle.update();
  paddle.show();

  // Atualizar e Mostrar a Bola
  ball.update();
  ball.checkEdges();
  ball.checkPaddle(paddle);
  ball.show();

  // Atualizar e Mostrar os Tijolos
  for (let i = bricks.length - 1; i >= 0; i--) {
    bricks[i].show();
    if (ball.hits(bricks[i])) {
      ball.yspeed *= -1; // Inverte a direção vertical da bola
      bricks.splice(i, 1); // Remove o tijolo atingido
      score += 10;
    }
  }

  // Verificar Condição de Vitória
  if (bricks.length === 0) {
    win = true;
  }

  // Verificar Condição de Derrota (Bola caiu)
  if (ball.pos.y > height) {
    gameOver = true;
  }
}

// Reiniciar o jogo ao pressionar a barra de espaço caso tenha terminado, ou iniciar o jogo a partir da tela de início
function keyPressed() {
  if (!gameStarted && key === ' ') {
    gameStarted = true;
  }
  if ((gameOver || win) && key === ' ') {
    resetGame();
  }
}



function resetGame() {
  score = 0;
  gameOver = false;
  win = false;
  
  paddle = new Paddle();
  ball = new Ball();
  bricks = [];

  // Criar a grade de tijolos
  let brickWidth = width / cols;
  let brickHeight = 25;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      // Cores alternadas por linha para ficar bonito
      let brickColor = color((r * 40) % 255, 100, 255 - (r * 30));
      bricks.push(new Brick(c * brickWidth + 5, r * brickHeight + 60, brickWidth - 10, brickHeight - 5, brickColor));
    }
  }
}

function showStartScreen() {
  background(20);
  textAlign(CENTER, CENTER);
  textSize(50);
  fill(255);
  text("BREAKOUT", width / 2, height / 2 - 20);
  textSize(20);
  fill(200);
  text("Pressione ESPAÇO para começar", width / 2, height / 2 + 40);
}

function showEndScreen(message, textColor) {
  textAlign(CENTER, CENTER);
  textSize(50);
  fill(textColor);
  text(message, width / 2, height / 2 - 20);
  textSize(20);
  fill(255);
  text("Pressione ESPAÇO para reiniciar", width / 2, height / 2 + 40);
}

// --- CLASSE DA RAQUETE (PADDLE) ---
class Paddle {
  constructor() {
    this.w = 120;
    this.h = 15;
    this.pos = createVector(width / 2 - this.w / 2, height - 40);
    this.speed = 8;
  }

  show() {
    fill(0, 200, 255);
    noStroke();
    rect(this.pos.x, this.pos.y, this.w, this.h, 5); // Cantos arredondados
  }

  update() {
    // Movimentação pelas setas do teclado
    if (keyIsDown(LEFT_ARROW)) {
      this.pos.x -= this.speed;
    }
    if (keyIsDown(RIGHT_ARROW)) {
      this.pos.x += this.speed;
    }
    // Restringir a raquete dentro da tela
    this.pos.x = constrain(this.pos.x, 0, width - this.w);
  }
}

// --- CLASSE DA BOLA (BALL) ---
class Ball {
  constructor() {
    this.r = 10; // Raio
    this.pos = createVector(width / 2, height / 2);
    // Velocidade inicial aleatória para cima
    this.xspeed = random(-4, 4);
    this.yspeed = -5;
  }

  show() {
    fill(255, 255, 0);
    noStroke();
    ellipse(this.pos.x, this.pos.y, this.r * 2);
  }

  update() {
    this.pos.x += this.xspeed;
    this.pos.y += this.yspeed;
  }

  checkEdges() {
    // Paredes laterais
    if (this.pos.x - this.r < 0 || this.pos.x + this.r > width) {
      this.xspeed *= -1;
    }
    // Teto
    if (this.pos.y - this.r < 0) {
      this.yspeed *= -1;
    }
  }

  // Colisão com a Raquete
  checkPaddle(p) {
    if (this.pos.y + this.r >= p.pos.y && 
        this.pos.y - this.r <= p.pos.y + p.h && 
        this.pos.x >= p.pos.x && 
        this.pos.x <= p.pos.x + p.w) {
      
      // Controla a direção do rebote baseado em onde a bola bateu na raquete
      let relativeIntersectX = (p.pos.x + (p.w / 2)) - this.pos.x;
      let normalizedIntersectX = relativeIntersectX / (p.w / 2);
      let bounceAngle = normalizedIntersectX * (PI / 3); // Ângulo máximo de 60 graus
      
      this.xspeed = -6 * sin(bounceAngle);
      this.yspeed = -6 * cos(bounceAngle);
    }
  }

  // Colisão com os Tijolos (AABB Collision)
  hits(brick) {
    let closestX = constrain(this.pos.x, brick.x, brick.x + brick.w);
    let closestY = constrain(this.pos.y, brick.y, brick.y + brick.h);

    let distanceX = this.pos.x - closestX;
    let distanceY = this.pos.y - closestY;

    let distanceSquared = (distanceX * distanceX) + (distanceY * distanceY);
    return distanceSquared < (this.r * this.r);
  }
}

// --- CLASSE DO TIJOLO (BRICK) ---
class Brick {
  constructor(x, y, w, h, c) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.color = c;
  }

  show() {
    fill(this.color);
    stroke(20); // Linha preta fina separando os tijolos
    strokeWeight(2);
    rect(this.x, this.y, this.w, this.h, 3);
  }
}