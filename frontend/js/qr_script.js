// This Code is Written By  -- ASIM HUSAIN

// Set up canvas and context
let canvas = document.getElementById('nokey'),
    ctx = canvas.getContext('2d'),
    can_w = window.innerWidth,
    can_h = window.innerHeight;

canvas.width = can_w;
canvas.height = can_h;

// Animation state
let BALL_NUM = 45;
let ball_color = { r: 207, g: 255, b: 4 };
let R = 2, balls = [], alpha_f = 0.03;
let link_line_width = 1, dis_limit = 250;
let mouse_in = false;
let animationId;

let mouse_ball = { x: 0, y: 0, vx: 0, vy: 0, r: 0, type: 'mouse' };

// Utility Functions
function getRandomSpeed(pos) {
  let min = -1, max = 1;
  switch (pos) {
    case 'top': return [randomNumFrom(min, max), randomNumFrom(0.1, max)];
    case 'right': return [randomNumFrom(min, -0.1), randomNumFrom(min, max)];
    case 'bottom': return [randomNumFrom(min, max), randomNumFrom(min, -0.1)];
    case 'left': return [randomNumFrom(0.1, max), randomNumFrom(min, max)];
  }
}
function randomArrayItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
function randomNumFrom(min, max) {
  return Math.random() * (max - min) + min;
}
function randomSidePos(length) {
  return Math.ceil(Math.random() * length);
}
function getDisOf(b1, b2) {
  let dx = b1.x - b2.x;
  let dy = b1.y - b2.y;
  return Math.sqrt(dx * dx + dy * dy);
}

// Ball Functions
function getRandomBall() {
  let pos = randomArrayItem(['top', 'right', 'bottom', 'left']);
  let [vx, vy] = getRandomSpeed(pos);
  let x, y;
  switch (pos) {
    case 'top': x = randomSidePos(can_w); y = -R; break;
    case 'right': x = can_w + R; y = randomSidePos(can_h); break;
    case 'bottom': x = randomSidePos(can_w); y = can_h + R; break;
    case 'left': x = -R; y = randomSidePos(can_h); break;
  }
  return { x, y, vx, vy, r: R, alpha: 1, phase: randomNumFrom(0, 10) };
}

function renderBalls() {
  balls.forEach(b => {
    if (!b.hasOwnProperty('type')) {
      ctx.fillStyle = `rgba(${ball_color.r},${ball_color.g},${ball_color.b},${b.alpha})`;
      ctx.beginPath();
      ctx.arc(b.x, b.y, R, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.fill();
    }
  });
}

function updateBalls() {
  let new_balls = [];
  balls.forEach(b => {
    b.x += b.vx;
    b.y += b.vy;
    if (b.x > -50 && b.x < can_w + 50 && b.y > -50 && b.y < can_h + 50) {
      new_balls.push(b);
    }
    b.phase += alpha_f;
    b.alpha = Math.abs(Math.cos(b.phase));
  });
  balls = new_balls;
}

function renderLines() {
  for (let i = 0; i < balls.length; i++) {
    for (let j = i + 1; j < balls.length; j++) {
      let fraction = getDisOf(balls[i], balls[j]) / dis_limit;
      if (fraction < 1) {
        let alpha = (1 - fraction).toString();
        ctx.strokeStyle = `rgba(150,150,150,${alpha})`;
        ctx.lineWidth = link_line_width;
        ctx.beginPath();
        ctx.moveTo(balls[i].x, balls[i].y);
        ctx.lineTo(balls[j].x, balls[j].y);
        ctx.stroke();
        ctx.closePath();
      }
    }
  }
}

function addBallIfy() {
  if (balls.length < BALL_NUM) {
    balls.push(getRandomBall());
  }
}

function render() {
  ctx.clearRect(0, 0, can_w, can_h);
  renderBalls();
  renderLines();
  updateBalls();
  addBallIfy();
  animationId = window.requestAnimationFrame(render);
}

function initBalls(num) {
  balls = [];
  for (let i = 0; i < num; i++) {
    balls.push({
      x: randomSidePos(can_w),
      y: randomSidePos(can_h),
      vx: getRandomSpeed('top')[0],
      vy: getRandomSpeed('top')[1],
      r: R,
      alpha: 1,
      phase: randomNumFrom(0, 10),
    });
  }
}

function initCanvas() {
  cancelAnimationFrame(animationId);
  can_w = canvas.width = window.innerWidth;
  can_h = canvas.height = window.innerHeight;
  initBalls(BALL_NUM);
  render(); 
}

// Start animation
initCanvas();

// On resize
window.addEventListener('resize', initCanvas);

// Mouse interaction
canvas.addEventListener('mouseenter', () => {
  mouse_in = true;
  balls.push(mouse_ball);
});
canvas.addEventListener('mouseleave', () => {
  mouse_in = false;
  balls = balls.filter(b => !b.hasOwnProperty('type'));
});
canvas.addEventListener('mousemove', e => {
  mouse_ball.x = e.pageX;
  mouse_ball.y = e.pageY;
});

// QR CODE GENERATION

const generateBtn = document.getElementById("generateBtn");
const qrImage = document.getElementById("qrImage");
const urlInput = document.getElementById("urlInput");
const mediaUpload = document.getElementById("mediaUpload");
const qrQuality = document.getElementById("qrQuality");
const qrType = document.getElementById("qrType");
const iconBox = document.querySelector(".action-icons");
const backIcon = document.getElementById("backIcon");

generateBtn.addEventListener("click", async () => {
  let urlValue = urlInput.value.trim();
  const size = qrQuality.value;
  const format = qrType.value;

  if (urlValue !== "") {
    generateQR(urlValue, size, format);
  } else {
    alert("Please provide a URL.");
  }
});

function generateQR(data, size, format) {
  const encoded = encodeURIComponent(data);
  qrImage.src = `https://api.qrserver.com/v1/create-qr-code/?data=${encoded}&size=${size}&format=${format}`;
  generateBtn.style.display = "none";
  iconBox.style.display = "flex";
  backIcon.style.display = "block";
}

backIcon.addEventListener("click", () => {
  qrImage.src = "https://api.qrserver.com/v1/create-qr-code/?data=default&size=200x200";
  urlInput.value = "";
  generateBtn.style.display = "inline-block";
  iconBox.style.display = "none";
  backIcon.style.display = "none";
});

function fetchImageAsBlob(url) {
  return fetch(url).then(res => res.blob());
}

document.getElementById("downloadIcon").addEventListener("click", () => {
  const url = qrImage.src;
  fetchImageAsBlob(url).then(blob => {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "qr-code." + qrType.value;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
});

document.getElementById("shareIcon").addEventListener("click", async () => {
  const url = qrImage.src;
  const blob = await fetchImageAsBlob(url);
  const file = new File([blob], "qr-code." + qrType.value, { type: blob.type });

  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({
        files: [file],
        title: "QR Code",
        text: "Scan this QR Code",
      });
    } catch (error) {
      alert("Share failed: " + error);
    }
  } else {
    alert("Your device doesn't support file sharing.");
  }
});

document.getElementById("pageBackIcon").addEventListener("click", () => {
  window.location.href = "index.html";
});

// Theme toggle
function toggleTheme() {
  const body = document.body;
  const icon = document.getElementById('themeIcon');

  if (body.classList.contains('dark')) {
    body.classList.remove('dark');
    body.classList.add('light');
    icon.classList.remove('sun');
  } else {
    body.classList.remove('light');
    body.classList.add('dark');
    icon.classList.add('sun');
  }

  const canvas = document.querySelector('canvas');
  if (canvas) {
    canvas.classList.toggle('dark');
    canvas.classList.toggle('light');
  }
}

window.onload = function () {
  if (!document.body.classList.contains('light') && !document.body.classList.contains('dark')) {
    document.body.classList.add('light');
  }
};