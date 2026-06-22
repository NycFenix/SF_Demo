/* global canvas */
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

// variável do shader
let faShader;

function preload() {
  console.log("Carregando o shader...");
  try {
    faShader = loadShader('background.vert', 'background.glsl');
  } catch (error) {
    console.log("Erro ao carregar o shader:", error);
  }
}

function setup() {
  createCanvas(800, 600, WEBGL);
  resetGame();
}

function draw() {
  background(0);
  renderAeroBackground();

  // 🔴 CORREÇÃO: Propriedade nativa GL em maiúsculo para desativar o depth test com segurança
  let gl = this._renderer.GL;
  if (gl) {
    gl.disable(gl.DEPTH_TEST);
  }

  push();
  translate(-width/2, -height/2); // Ajusta a posição para o sistema de coordenadas 2D padrão (0,0 no topo esquerdo)
  drawHUD();

  if (checkGameStatus()) {
    pop();
    if (gl) gl.enable(gl.DEPTH_TEST);
    return;
  }
  
  updateEntities();
  pop();
  
  if (gl) {
    gl.enable(gl.DEPTH_TEST);
  }
}

// FUNÇÕES DE RENDERIZAÇÃO -------------------------------------------------- 

function renderAeroBackground() {
  push();
  resetMatrix();
  shader(faShader);
  
  faShader.setUniform("u_resolution", [width, height]); 
  faShader.setUniform("u_time", millis() / 1000.0); 
  rect(-width/2, -height/2, width, height); 
  resetShader();
  pop();
}

function drawHUD() {
  push();
  drawPainelVidro(20, 20, 150, 40);
  fill(255);
  textSize(18);
  textFont("Segoe UI", 'Arial');
  textAlign(LEFT, CENTER);
  text("Pontos: " + score, 30, 40); // Ajustado y levemente para centralizar o texto verticalmente no HUD
  pop();
}

function drawPainelVidro(x, y, w, h) {
  push();
  translate(0, 0 ,1);
  stroke(255, 255, 255, 180);
  strokeWeight(2);
  fill(255, 255, 255, 60); // Vidro semi-transparente
  rect(x, y, w, h, 12); // Retângulo com cantos arredondados
  
  // Brilho reflexivo
  noStroke();
  fill(255, 255, 255, 80);
  beginShape();
  vertex(x+2, y+2);
  vertex(x + w - 2, y + 2);
  vertex(x + w - 2, y + h * 0.4);
  bezierVertex(x + w * 0.7, y + h * 0.6, x + w * 0.3, y + h * 0.2, x + 2, y + h * 0.4);
  endShape(CLOSE);
  pop();
}

function checkGameStatus() {
  if(gameOver) {
    showEndScreen("FIM DE JOGO", color(255, 100, 100));
    return true;
  }

  if (win) {
    showEndScreen("VOCÊ VENCEU!", color(100, 255, 100));
    return true;
  }
  return false;
}

function updateEntities() {
  // Raquete
  paddle.update();
  paddle.show();

  // Bola
  ball.update();
  ball.checkEdges();
  ball.checkPaddle(paddle);
  ball.show();

  // Tijolos
  for (let i = bricks.length - 1; i >= 0; i--) {
    bricks[i].show();
    if (ball.hits(bricks[i])) {
      ball.yspeed *= -1;
      bricks.splice(i, 1);
      score += 10;
    }
  }

  if (bricks.length === 0) {
    win = true;
  }

  if (ball.pos.y > height) {
    gameOver = true;
  }
}

function showEndScreen(message, textColor) {
  // 🔴 CORREÇÃO: Resetamos a matriz localmente para que o texto não herde distorções 3D
  push();
  resetMatrix();
  
  // Como resetamos a matriz, (0,0) voltou a ser o centro da tela.
  // Desenha o painel centralizado usando coordenadas relativas ao centro:
  drawPainelVidro(-200, -80, 400, 160);
  
  // Isola as fontes e aplica uma leve elevação em Z para desgrudar do painel de fundo
  push();
  translate(0, 0, 5); 
  
  noStroke();
  textAlign(CENTER, CENTER);
  textFont("Segoe UI", 'Arial');
  
  // Mensagem Principal (FIM DE JOGO / VOCÊ VENCEU)
  fill(textColor);
  textSize(42);
  text(message, 0, -20);
  
  // Mensagem Secundária
  fill(255);
  textSize(16);
  text("Pressione ESPAÇO para reiniciar", 0, 40);
  
  pop();
  pop();
}

// LÓGICA DE CONTROLE --------------------------------------------------

function keyPressed() {
  if ((gameOver || win) && key === ' ')  {
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

  let brickWidth = (width - 40) / cols;
  let brickHeight = 30;

  let corColunas = [
    color(0, 230, 255, 220),
    color(110, 235 , 50, 220),
    color(255, 210, 0, 220),
    color(255, 100, 0, 220),
  ];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      bricks.push(new Brick(c * brickWidth + 20, r * brickHeight + 90, brickWidth - 8, brickHeight - 8, corColunas[r % corColunas.length]));
    }
  }
}

// --- CLASSE DA RAQUETE ---
class Paddle {
  constructor() {
    this.w = 140;
    this.h = 20;
    this.pos = createVector(width / 2 - this.w / 2, height - 50);
    this.speed = 11;
  }
  
  show() {
    push(); // 🔴 CORREÇÃO: push e pop adicionados para isolar o translate e não quebrar a física do restante do jogo
    translate(0, 0, 1);
    drawPainelVidro(this.pos.x, this.pos.y, this.w, this.h);
    pop();
  }
  
  update() {
    if (keyIsDown(LEFT_ARROW)) {
      this.pos.x -= this.speed;
    }
    if (keyIsDown(RIGHT_ARROW)) {
      this.pos.x += this.speed;
    }
    this.pos.x = constrain(this.pos.x, 10, width - this.w-10);
  }
}

// --- CLASSE DA BOLA ------
class Ball {
  constructor() {
    this.r = 12;
    this.pos = createVector(width / 2, height -100);
    this.xspeed = random(-5, 5);
    this.yspeed = -7;
  }
  
  show() {
    push();
    noStroke();
    fill(0, 180, 255, 200);
    ellipse(this.pos.x, this.pos.y, this.r * 2);
    fill(255, 255, 255, 220);
    ellipse(this.pos.x - this.r * 0.3, this.pos.y - this.r * 0.3, this.r * 0.8, this.r * 0.5); 
    pop();
  }
  
  update() {
    this.pos.x += this.xspeed;
    this.pos.y += this.yspeed;
  }
  
  checkEdges() {
    if (this.pos.x - this.r < 0 || this.pos.x + this.r > width) {
      this.xspeed *= -1;
    }
    if (this.pos.y - this.r < 0) {
      this.yspeed *= -1;
    }
  }

  checkPaddle(p) {
    if (this.pos.y + this.r >= p.pos.y && 
        this.pos.y - this.r <= p.pos.y + p.h && 
        this.pos.x >= p.pos.x && 
        this.pos.x <= p.pos.x + p.w) {
      
      let relativeIntersectX = (p.pos.x + (p.w / 2)) - this.pos.x;
      let normalizedIntersectX = relativeIntersectX / (p.w / 2);
      let bounceAngle = normalizedIntersectX * (PI / 3);
      
      this.xspeed = -7 * sin(bounceAngle);
      this.yspeed = -7 * cos(bounceAngle);
    }
  }

  hits(brick) {
    let closestX = constrain(this.pos.x, brick.x, brick.x + brick.w);
    let closestY = constrain(this.pos.y, brick.y, brick.y + brick.h);

    let distanceX = this.pos.x - closestX;
    let distanceY = this.pos.y - closestY;

    let distanceSquared = (distanceX * distanceX) + (distanceY * distanceY);
    return distanceSquared < (this.r * this.r);
  }
}

// CLASSE DO TIJOLO 
class Brick {
  constructor(x, y, w, h, c) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.color = c;
  }

  show() {
    push();
    stroke(255, 255, 255, 150);
    strokeWeight(1.5);
    fill(this.color);
    rect(this.x, this.y, this.w, this.h, 8);

    noStroke();
    fill(255, 255, 255, 70);
    rect(this.x + 1, this.y + 1, this.w - 2, this.h * 0.4, 6, 6, 0, 0);
    pop();
  }
}