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

// 🟢 CORREÇÃO: Alterado de preLoad para preload (tudo minúsculo para o p5.js reconhecer)
function preload() {
  console.log("Carregando o shader..."); // 🟢 CORREÇÃO: Removido o 'F' digitado por engano
  try {
    faShader = loadShader('background.vert', 'background.glsl');

  } catch (error) {
    console.log("Erro ao carregar o shader:", error);
  }
}


function setup() {
  createCanvas(800, 600, WEBGL);

  // 🟢 CORREÇÃO: Bloco do shader de fallback removido completamente conforme solicitado.
  // Agora o p5.js usará estritamente os arquivos físicos .vert e .glsl.
  
  resetGame();
}

function draw() {
  
  renderAeroBackground();
  // Mostrar Pontuação
  push();
  translate(-width/2, -height/2); // Ajusta a posição para o sistema de coordenadas 2D
  drawHUD();

  if (checkGameStatus()) {
    pop();
    return;
  }
  
  updateEntities();
  pop();
  
  // if (gameOver) {
  //   showEndScreen("FIM DE JOGO", color(255, 50, 50));
  //   return;
  // }

  // if (win) {
  //   showEndScreen("VOCÊ VENCEU!", color(50, 255, 50));
  //   return;
  // }

  // // Atualiza e mostra a raquete
  // paddle.update();
  // paddle.show();

  // // Atualiza e mostra a bola
  // ball.update();
  // ball.checkEdges();
  // ball.checkPaddle(paddle);
  // ball.show();

  // // Atualiza e mostra os tijolos
  // for (let i = bricks.length - 1; i >= 0; i--) {
  //   bricks[i].show();
  //   if (ball.hits(bricks[i])) {
  //     ball.yspeed *= -1; // Inverte a direção vertical da bola
  //     bricks.splice(i, 1); // Remove o tijolo atingido
  //     score += 10;
  //   }
  // }

  // // Verifica a Condição de Vitória
  // if (bricks.length === 0) {
  //   win = true;
  // }

  // // Verifica o Condição de Derrota (Bola caiu)
  // if (ball.pos.y > height) {
  //   gameOver = true;
  // }
}

// FUNÇÕES DE RENDERIZAÇÃO -------------------------------------------------- 

function renderAeroBackground() {
  push();
  
  resetMatrix();
  shader(faShader);
  
  faShader.setUniform("u_resolution",   [width, height]); 
  faShader.setUniform("u_time", millis() / 1000.0); // Tempo em segundos
  rect(0, 0, width, height); // Desenha um retângulo que cobre toda a tela
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
  text("Pontos: " + score, 30, 30);
  pop();
}

function drawPainelVidro(x, y, w, h) {
  push();
  stroke(255,255, 255, 180);
  strokeWeight(2);
  fill(255,255, 255, 60); // Vidro semi-transparente
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

  // Bolda

  ball.update();
  ball.checkEdges();
  ball.checkPaddle(paddle);
  ball.show();

  // Tijolos (Renderiza em ordem reversa para evitar problemas de remoção do array)
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



// function showStartScreen() {
//   background(20);
//   textAlign(CENTER, CENTER);
//   textSize(50);
//   fill(255);
//   text("BREAKOUT", width / 2, height / 2 - 20);
//   textSize(20);
//   fill(200);
//   text("Pressione ESPAÇO para começar", width / 2, height / 2 + 40);
// }

function showEndScreen(message, textColor) {
  push();
  drawPainelVidro(width/2 - 200, height/2 - 80, 400, 160);
  textAlign(CENTER, CENTER);
  textSize(50);
  fill(textColor);
  text(message, width / 2, height / 2 - 20);
  textSize(16);
  fill(50);
  text("Pressione ESPAÇO para reiniciar", width / 2, height / 2 + 40);
  pop();
}



// LÓGICA DE CONTROLE --------------------------------------------------


// Reinicia o jogo ao pressionar a barra de espaço caso tenha terminado, ou iniciar o jogo a partir da tela de início
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

  // Cria a grade de tijolos
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
      // Cores alternadas por linha para ficar nice
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
    this.speed = 10;
  }
  
  show() {
    // fill(0, 200, 255);
    // noStroke();
    // rect(this.pos.x, this.pos.y, this.w, this.h, 5); // Cantos arredondados
    
    drawPainelVidro(this.pos.x, this.pos.y, this.w, this.h);
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
    this.pos.x = constrain(this.pos.x, 10, width - this.w-10);
  }
}

// --- CLASSE DA BOLA ------
class Ball {
  constructor() {
    this.r = 12; // Raio
    this.pos = createVector(width / 2, height -100);

    // Velocidade inicial aleatória para cima
    this.xspeed = random(-5, 5);
    this.yspeed = -6;
  }
  
  show() {
    push();
    noStroke();
    fill(0, 180, 255, 200);
    ellipse(this.pos.x, this.pos.y, this.r * 2);
    // Reflexsizinho
    fill(255,255, 255, 220);
    ellipse(this.pos.x - this.r * 0.3, this.pos.y - this.r * 0.3, this.r * 0.8, this.r * 0.5); 
    pop();
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

  // Colisão com raquete
  checkPaddle(p) {
    if (this.pos.y + this.r >= p.pos.y && 
        this.pos.y - this.r <= p.pos.y + p.h && 
        this.pos.x >= p.pos.x && 
        this.pos.x <= p.pos.x + p.w) {
      
      // Controla a direção do rebote baseado em onde a bola bateu na raquete
      let relativeIntersectX = (p.pos.x + (p.w / 2)) - this.pos.x;
      let normalizedIntersectX = relativeIntersectX / (p.w / 2);
      let bounceAngle = normalizedIntersectX * (PI / 3); // Ângulo máximo de 60 graus
      
      this.xspeed = -7 * sin(bounceAngle);
      this.yspeed = -7 * cos(bounceAngle);
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
    // fill(this.color);
    // stroke(20); // Linha preta fina separando os tijolos
    // strokeWeight(2);
    // rect(this.x, this.y, this.w, this.h, 3);

    push();
    stroke(255, 255, 255, 150);
    strokeWeight(1.5);
    fill(this.color);
    rect(this.x, this.y, this.w, this.h, 8);

      // Brilho reflexivo

        noStroke();
        fill(255, 255, 255, 70);
        rect(this.x + 1, this.y + 1, this.w - 2, this.h * 0.4, 6, 6, 0, 0);
        pop();
  }
}