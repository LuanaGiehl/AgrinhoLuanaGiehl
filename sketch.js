let milhos = [];
let tratorX = 0;
let lastPlantTime = 0;
let milhoCount = 0;
let feira = [];
let clientes = [];
let festaAtiva = false;
let vendidos = 0;
let nivel = 1;
let metaMilho = 10;

let tempoNivel = 30000; // 30 segundos por nível
let tempoInicioNivel;

function setup() {
  createCanvas(800, 600);
  textFont('Arial');
  textAlign(LEFT);
  tempoInicioNivel = millis();
}

function draw() {
  background('#87CEEB');
  drawCampoECidade();
  drawFeira();
  moverTrator();
  atualizarMilhos();
  mostrarClientes();
  mostrarInterface();

  if (!festaAtiva) {
    // Verifica se atingiu meta para festa
    if (feira.length >= metaMilho) {
      comecarFesta();
    }
  } else {
    animarFesta();
  }

  // Verifica o tempo do nível
  if (!festaAtiva && millis() - tempoInicioNivel > tempoNivel) {
    mostrarMensagemFimTempo();
  }
}

function mostrarMensagemFimTempo() {
  fill(255, 0, 0, 200);
  rect(width / 2 - 180, height / 2 - 50, 360, 100, 20);
  fill(255);
  textSize(24);
  textAlign(CENTER, CENTER);
  text("Tempo esgotado! Reiniciando o nível...", width / 2, height / 2);
  
  // Após 3 segundos, reinicia o nível
  if (millis() - tempoInicioNivel > tempoNivel + 3000) {
    reiniciarNivel();
  }
}

function reiniciarNivel() {
  milhos = [];
  feira = [];
  clientes = [];
  milhoCount = 0;
  tratorX = 0;
  festaAtiva = false;
  tempoInicioNivel = millis();
}

function drawCampoECidade() {
  // Sol no lado direito
  fill('yellow');
ellipse(width - 60, 60, 80, 80);

  // Nuvens
  drawNuvem(200, 100);
  drawNuvem(350, 60);
  drawNuvem(550, 120);

  // Campo
  fill('#7CFC00');
  noStroke();
  rect(0, height / 2, width, height / 2);

  // Árvores e flores
  drawArvore(50, height - 80);
  drawArvore(100, height - 90);
  drawFlor(40, height - 40);
  drawFlor(70, height - 35);
  drawFlor(90, height - 45);

  // Prédios atrás do trator
  drawPredio(80, height / 2 - 150, 60, 150, '#4d4d4d', nivel);
  drawPredio(160, height / 2 - 180, 80, 180, '#5a5a5a', nivel);
  drawPredio(260, height / 2 - 120, 60, 120, '#606060', nivel);
}

function drawPredio(x, y, w, h, cor, nivel) {
  fill(cor);
  rect(x, y, w, h);
  fill('#b3b3b3');
  let linhas = constrain(nivel + 2, 3, 7);
  for (let i = 0; i < linhas; i++) {
    for (let j = 0; j < 3; j++) {
      rect(x + 5 + j * 20, y + 10 + i * 25, 10, 15);
    }
  }
  fill('#333');
  rect(x + w / 2 - 10, y + h - 30, 20, 30);
}

function drawNuvem(x, y) {
  fill(255);
  noStroke();
  ellipse(x, y, 50, 40);
  ellipse(x + 25, y + 10, 50, 40);
  ellipse(x - 25, y + 10, 50, 40);
}

function drawArvore(x, y) {
  // Tronco mais grosso e alto
  fill('#8B4513');
  rect(x - 7, y, 14, 40);

  // Folhagem com múltiplas elipses curvas
  fill('#228B22');
  ellipse(x, y - 10, 60, 50);
  ellipse(x - 20, y - 20, 40, 40);
  ellipse(x + 20, y - 20, 40, 40);
  ellipse(x, y - 30, 50, 40);
}

function drawFlor(x, y) {
  fill('green');
  rect(x - 1, y, 2, 10);
  fill('pink');
  ellipse(x, y, 6, 6);
  ellipse(x + 4, y, 6, 6);
  ellipse(x - 4, y, 6, 6);
  ellipse(x, y - 4, 6, 6);
  fill('yellow');
  ellipse(x, y, 4, 4);
}

function moverTrator() {
  fill('#FF0000');
  rect(tratorX, height / 2 - 35, 70, 30);
  fill('#CCCCCC');
  rect(tratorX + 10, height / 2 - 50, 25, 15);
  fill('black');
  ellipse(tratorX + 15, height / 2, 20, 20);
  ellipse(tratorX + 55, height / 2, 25, 25);

  if (millis() - lastPlantTime > 500 && milhoCount < metaMilho) {
    milhos.push(new Milho(tratorX + 30));
    lastPlantTime = millis();
    milhoCount++;
  }

  tratorX += 1;
  if (tratorX > width) {
    tratorX = -60;
  }
}

function drawFeira() {
  fill('#8B4513');
  rect(width - 210, height - 160, 180, 80);
  fill('#CD5C5C');
  triangle(width - 210, height - 160, width - 120, height - 220, width - 30, height - 160);
  fill('#FFE4C4');
  rect(width - 200, height - 150, 160, 60);
  fill('#654321');
  rect(width - 190, height - 100, 140, 10);

  fill(0);
  textSize(16);
  textAlign(CENTER);
  text("Feira Municipal do Milho", width - 110, height - 180);
  textAlign(LEFT);

  fill('gold');
  for (let i = 0; i < feira.length; i++) {
    let row = floor(i / 6);
    let col = i % 6;
    ellipse(width - 180 + col * 25, height - 140 + row * 30, 15, 30);
  }
}

function atualizarMilhos() {
  for (let i = milhos.length - 1; i >= 0; i--) {
    milhos[i].update();
    milhos[i].draw();
    if (milhos[i].estado === 'pronto') {
      feira.push(milhos[i]);
      milhos.splice(i, 1);
    }
  }
}

function comecarFesta() {
  festaAtiva = true;
  for (let i = 0; i < feira.length; i++) {
    clientes.push(new Cliente(50 + i * 30, height - 50));
  }
}

function mostrarClientes() {
  for (let i = clientes.length - 1; i >= 0; i--) {
    clientes[i].andar();
    clientes[i].desenhar();
    if (clientes[i].x > width - 150 && feira.length > 0) {
      feira.pop();
      vendidos++;
      clientes.splice(i, 1);
    }
  }
  if (festaAtiva && clientes.length === 0) {
    festaAtiva = false;
    nivel++;
    milhoCount = 0;
    tempoInicioNivel = millis(); // Reinicia o tempo do nível
  }
}

function animarFesta() {
  fill(random(255), random(255), random(255), 150);
  textSize(32);
  textAlign(CENTER);
  text("🎉 Festa do Milho! 🎉", width / 2, 100);
  textAlign(LEFT);
}

function mostrarInterface() {
  fill(0);
  textSize(14);
  text(`Milhos Plantados: ${milhoCount}`, 10, 20);
  text(`Milhos na Feira: ${feira.length}`, 10, 40);
  text(`Milhos Vendidos: ${vendidos}`, 10, 60);
  text(`Nível: ${nivel} (Meta: ${metaMilho})`, 10, 80);
  text("Trator automático", 10, 100);
}

class Milho {
  constructor(x) {
    this.x = x;
    this.y = height / 2 - 20;
    this.plantadoEm = millis();
    this.estado = 'crescendo';
  }

  update() {
    if (millis() - this.plantadoEm >= 10000 && this.estado === 'crescendo') {
      this.estado = 'indo';
      this.vx = (width - 100 - this.x) / 60;
    }
    if (this.estado === 'indo') {
      this.x += this.vx;
      if (this.x >= width - 100) {
        this.estado = 'pronto';
      }
    }
  }

  draw() {
    if (this.estado !== 'pronto') {
      fill('gold');
      ellipse(this.x, this.y, 10, 25);
    }
  }
}

class Cliente {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vel = 1.5;
    this.corpo = color(random(100, 255), random(100, 255), random(100, 255));
    this.cabelo = color(random(0, 100), random(0, 100), random(0, 100));
    this.acessorio = random(['chapeu', 'oculos', 'nenhum']);
  }

  andar() {
    this.x += this.vel;
  }

  desenhar() {
    fill(this.cabelo);
    ellipse(this.x, this.y - 35, 22, 15);
    fill('#FFD700');
    ellipse(this.x, this.y - 25, 20, 20);
    fill(this.corpo);
    rect(this.x - 10, this.y - 25, 20, 30);
    fill('#FFD700');
    rect(this.x - 15, this.y - 25, 5, 20);
    rect(this.x + 10, this.y - 25, 5, 20);
    fill('#000');
    rect(this.x - 10, this.y + 5, 5, 10);
    rect(this.x + 5, this.y + 5, 5, 10);

    if (this.acessorio === 'chapeu') {
      fill('#8B0000');
      arc(this.x, this.y - 40, 25, 12, PI, 0);
    } else if (this.acessorio === 'oculos') {
      fill(0);
      rect(this.x - 7, this.y - 27, 5, 5);
      rect(this.x + 2, this.y - 27, 5, 5);
      line(this.x - 2, this.y - 24, this.x + 2, this.y - 24);
    }
  }
}
