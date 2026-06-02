let colors = ["#22577a", "#38a3a5", "#57cc99", "#80ed99", "#c7f9cc"];
let particles = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  // 初始化一群隨機粒子
  for (let i = 0; i < 20; i++) {
    particles.push(new Particle({
      p: { x: random(width), y: random(height) },
      r: random(60, 120)
    }));
  }
}

function draw() {
  background(0);

  for (let p of particles) {
    p.update();
    p.draw();
  }
}

class Particle {
  constructor(args) { // 預設值 (工廠模式)
    this.r = args.r || 100;
    // 設定位置：若無傳入 args.p，則預設在畫布中心
    this.p = args.p ? createVector(args.p.x, args.p.y) : createVector(width / 2, height / 2);
    // 設定速度：若無傳入 args.v，則隨機產生方向
    this.v = args.v ? createVector(args.v.x, args.v.y) : createVector(random(-2, 2), random(-2, 2));
    // 設定加速度
    this.a = args.a || { x: 0, y: 0 };
    
    this.color1 = color(random(colors)); // 起始顏色
    this.color2 = color(random(colors)); // 目標顏色
    this.colorT = random(1);             // 顏色變化的進度 (0~1)
    
    // 賦予粒子個性/狀態：快樂或是生氣
    this.mode = random(["happy", "bad"]);
  }

  update() {
    // 向量運算：速度加上加速度，位置加上速度
    this.v.x += this.a.x;
    this.v.y += this.a.y;
    this.p.x += this.v.x;
    this.p.y += this.v.y;

    // 簡單的邊界檢查（反彈）
    if (this.p.x < this.r / 2 || this.p.x > width - this.r / 2) {
      this.v.x *= -1;
    }
    if (this.p.y < this.r / 2 || this.p.y > height - this.r / 2) {
      this.v.y *= -1;
    }

    // 顏色過渡邏輯
    this.colorT += 0.005; // 調整這個數值可以改變變色速度 (0.005 大約是 3 秒換一次顏色)
    if (this.colorT > 1) {
      this.color1 = this.color2; // 到達目標後，將目前的顏色設為起始顏色
      this.color2 = color(random(colors)); // 隨機選下一個目標顏色
      this.colorT = 0; // 重置進度
    }
  }

  draw() {
    push();
    translate(this.p.x, this.p.y);
    noStroke();

    let currentColor = lerpColor(this.color1, this.color2, this.colorT);
    fill(currentColor);

    // 1. 繪製耳朵
    triangle(-this.r * 0.45, -this.r * 0.2, -this.r * 0.4, -this.r * 0.7, -this.r * 0.15, -this.r * 0.45); // 左耳
    triangle(this.r * 0.45, -this.r * 0.2, this.r * 0.4, -this.r * 0.7, this.r * 0.15, -this.r * 0.45);  // 右耳
    
    // 2. 繪製臉部本體
    ellipse(0, 0, this.r);

    // 3. 繪製鬍鬚
    stroke(255, 150);
    strokeWeight(1);
    line(-this.r * 0.3, 0, -this.r * 0.7, -this.r * 0.1); // 左鬍鬚
    line(-this.r * 0.3, this.r * 0.1, -this.r * 0.7, this.r * 0.1);
    line(this.r * 0.3, 0, this.r * 0.7, -this.r * 0.1);  // 右鬍鬚
    line(this.r * 0.3, this.r * 0.1, this.r * 0.7, this.r * 0.1);

    // 4. 動態眼睛計算
    // 計算眼珠位移方向 (滑鼠位置 - 貓咪位置)
    let eyeDir = createVector(mouseX - this.p.x, mouseY - this.p.y);
    eyeDir.limit(this.r * 0.05); // 限制眼珠移動範圍，不讓它跑出眼白

    // 繪製兩隻眼睛
    for (let side of [-1, 1]) {
      push();
      translate(side * this.r * 0.2, -this.r * 0.1);
      // 眼白
      noStroke();
      fill(255);
      ellipse(0, 0, this.r * 0.25, this.r * 0.2);
      // 眼珠 (瞳孔)
      fill(0);
      ellipse(eyeDir.x, eyeDir.y, this.r * 0.1);
      pop();
    }

    // 5. 根據不同 mode 繪製表情細節
    if (this.mode === "happy") {
      noFill();
      stroke(0, 100);
      strokeWeight(this.r * 0.05);
      arc(0, this.r * 0.1, this.r * 0.3, this.r * 0.2, 0, PI); // 笑嘴
    } else {
      // 生氣眉毛
      stroke(0);
      strokeWeight(2);
      line(-this.r * 0.3, -this.r * 0.25, -this.r * 0.1, -this.r * 0.2);
      line(this.r * 0.3, -this.r * 0.25, this.r * 0.1, -this.r * 0.2);
      line(-this.r * 0.1, this.r * 0.2, this.r * 0.1, this.r * 0.2); // 扁嘴
    }
    pop();
  }
}