// This Code is Written By  -- ASIM HUSAIN

let scanner = null;
let linkUnshortened = false;
let originalLink = "";

// Start QR code scanning
function startQRScan(event) {
  event.stopPropagation();
  if (linkUnshortened) return;

  document.getElementById('qrScanIcon').style.display = 'none';
  document.getElementById('qrScanner').style.display = 'block';

  if (!scanner) scanner = new Html5Qrcode("reader");

  scanner.start(
    { facingMode: "environment" },
    { fps: 10, qrbox: 250 },
    decodedText => {
      document.getElementById('urlInput').value = decodedText;
      stopQRScan();
    },
    () => {}
  ).catch(err => {
    console.error("Camera init failed:", err);
    stopQRScan();
  });
}

// Stop QR code scanning
function stopQRScan() {
  if (scanner) {
    scanner.stop().then(() => {
      document.getElementById('qrScanner').style.display = 'none';
      document.getElementById('qrScanIcon').style.display = linkUnshortened ? 'none' : 'block';
    }).catch(console.error);
  }
}

// Show QR download/share options
function showQROptions() {
  document.getElementById('qrScanIcon').style.display = 'none';
  document.getElementById('qrCodeIcon').style.display = 'none';
  document.getElementById('qrIcons').style.display = 'flex';
}

// Hide QR options when clicking outside container
document.addEventListener('click', e => {
  const container = document.getElementById('qrContainer');
  if (!container.contains(e.target)) {
    document.getElementById('qrIcons').style.display = 'none';
    if (linkUnshortened) {
      document.getElementById('qrCodeIcon').style.display = 'block';
    }
  }
});

// Main Unshorten Logic
async function unshortenLink() {
  const inputBox = document.getElementById("urlInput");
  const shortUrl = inputBox.value.trim();
  if (!shortUrl) return;

  originalLink = shortUrl;

  const res = await fetch("https://tinyurl-qc0z.onrender.com/unshorten", { // Paste Backend Link Here ...
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ shortUrl }),
  });

  const data = await res.json();
  if (data.originalUrl) {
    inputBox.value = data.originalUrl;
    linkUnshortened = true;

    document.getElementById('qrScanIcon').style.display = 'none';
    document.getElementById('qrIcons').style.display = 'none';
    document.getElementById('qrCodeIcon').style.display = 'block';
    document.getElementById('copyWrapper').style.display = 'flex';
    document.getElementById('backArrow').style.display = 'block';
  } else {
    alert(data.error || "Unshorten failed");
  }
}

// Restore to original short link
function restoreOriginal() {
  document.getElementById("urlInput").value = originalLink;
  linkUnshortened = false;

  document.getElementById("qrScanIcon").style.display = 'block';
  document.getElementById("qrCodeIcon").style.display = 'none';
  document.getElementById("qrIcons").style.display = 'none';
  document.getElementById('copyWrapper').style.display = 'none';
  document.getElementById('backArrow').style.display = 'none';
}

// Copy unshortened link
function copyLink() {
  const link = document.getElementById("urlInput").value;
  navigator.clipboard.writeText(link)
    .then(() => {
      const copiedText = document.getElementById("copiedText");
      copiedText.style.opacity = "1";
      setTimeout(() => {
        copiedText.style.opacity = "0";
      }, 1500);
    })
    .catch(err => console.error("Failed to copy:", err));
}

// Download QR Code
function downloadQR() {
  const shortUrl = document.getElementById("urlInput").value;

  // Create hidden container
  const hiddenDiv = document.createElement('div');
  hiddenDiv.style.visibility = 'hidden';
  hiddenDiv.style.position = 'absolute';
  hiddenDiv.style.width = '256px';
  hiddenDiv.style.height = '256px';
  document.body.appendChild(hiddenDiv);

  // Generate QR
  const qr = new QRCode(hiddenDiv, {
    text: shortUrl,
    width: 256,
    height: 256,
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H
  });

  // Download after generation
  setTimeout(() => {
    const qrImg = hiddenDiv.querySelector('img');
    if (qrImg) {
      const link = document.createElement('a');
      link.href = qrImg.src;
      link.download = "short-url-qr.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    hiddenDiv.remove();
  }, 500);
}

// Share QR via Web Share API
function shareQR() {
  const text = document.getElementById("urlInput").value;
  if (navigator.share) {
    navigator.share({
      title: 'Original Link',
      text: 'Here is the unshortened link:',
      url: text,
    }).catch(console.error);
  } else {
    alert("Sharing not supported.");
  }
}

// Canvas Background Animation
var canvas = document.getElementById('nokey'),
  can_w = window.innerWidth,
  can_h = window.innerHeight,
  ctx = canvas.getContext('2d');

canvas.width = can_w;
canvas.height = can_h;

var BALL_NUM = 45;
var ball_color = { r: 207, g: 255, b: 4 };
var R = 2, balls = [], alpha_f = 0.03;
var link_line_width = 1, dis_limit = 250;

var mouse_ball = { x: 0, y: 0, vx: 0, vy: 0, r: 0, type: 'mouse' };
var mouse_in = false;

function getRandomSpeed(pos) {
  var min = -1, max = 1;
  switch (pos) {
    case 'top': return [Math.random() * 2 - 1, Math.random()];
    case 'right': return [-Math.random(), Math.random() * 2 - 1];
    case 'bottom': return [Math.random() * 2 - 1, -Math.random()];
    case 'left': return [Math.random(), Math.random() * 2 - 1];
  }
}

function randomSidePos(length) {
  return Math.ceil(Math.random() * length);
}

function getRandomBall() {
  var x = Math.random() * can_w;
  var y = Math.random() * can_h;
  var vx = Math.random() * 2 - 1;
  var vy = Math.random() * 2 - 1;
  return { x, y, vx, vy, r: R, alpha: 1, phase: Math.random() * 10 };
}

function renderBalls() {
  balls.forEach(b => {
    if (!b.type) {
      ctx.fillStyle = `rgba(${ball_color.r},${ball_color.g},${ball_color.b},${b.alpha})`;
      ctx.beginPath();
      ctx.arc(b.x, b.y, R, 0, Math.PI * 2);
      ctx.fill();
    }
  });
}

function updateBalls() {
  balls = balls.filter(b => {
    b.x += b.vx;
    b.y += b.vy;
    b.phase += alpha_f;
    b.alpha = Math.abs(Math.cos(b.phase));
    return b.x > -50 && b.x < can_w + 50 && b.y > -50 && b.y < can_h + 50;
  });
}

function renderLines() {
  for (let i = 0; i < balls.length; i++) {
    for (let j = i + 1; j < balls.length; j++) {
      let dist = Math.hypot(balls[i].x - balls[j].x, balls[i].y - balls[j].y);
      if (dist < dis_limit) {
        ctx.strokeStyle = `rgba(150,150,150,${1 - dist / dis_limit})`;
        ctx.lineWidth = link_line_width;
        ctx.beginPath();
        ctx.moveTo(balls[i].x, balls[i].y);
        ctx.lineTo(balls[j].x, balls[j].y);
        ctx.stroke();
      }
    }
  }
}

function addBallIfNeeded() {
  if (balls.length < BALL_NUM) balls.push(getRandomBall());
}

function render() {
  ctx.clearRect(0, 0, can_w, can_h);
  renderBalls();
  renderLines();
  updateBalls();
  addBallIfNeeded();
  requestAnimationFrame(render);
}

render();

// Handle canvas resize
window.addEventListener('resize', () => {
  can_w = window.innerWidth;
  can_h = window.innerHeight;
  canvas.width = can_w;
  canvas.height = can_h;
});

// Mouse interactivity
canvas.addEventListener('mouseenter', () => {
  mouse_in = true;
  balls.push(mouse_ball);
});

canvas.addEventListener('mouseleave', () => {
  mouse_in = false;
  balls = balls.filter(b => !b.type);
});

canvas.addEventListener('mousemove', e => {
  mouse_ball.x = e.pageX;
  mouse_ball.y = e.pageY;
});

// Theme Toggle Function
function toggleTheme() {
  const body = document.body;
  const icon = document.getElementById("themeIcon");
  const isDark = body.classList.contains("dark");
  body.classList.toggle("dark", !isDark);
  body.classList.toggle("light", isDark);
  canvas.classList.toggle("dark", !isDark);
  canvas.classList.toggle("light", isDark);
  icon.classList.toggle("moon", isDark);
  icon.classList.toggle("sun", !isDark);
}

// Contact Popup Functionality
function openContactPopup() {
  const popup = document.getElementById('contactPopup');
  const content = popup.querySelector('.contact-content');
  popup.style.display = 'flex';
  void content.offsetWidth;
  content.classList.add('show');
}

function closeContactPopup() {
  const popup = document.getElementById('contactPopup');
  const content = popup.querySelector('.contact-content');
  content.classList.remove('show');
  setTimeout(() => {
    popup.style.display = 'none';
  }, 400);
}

function submitContact() {
  const name = document.getElementById('contactName').value.trim();
  const mobile = document.getElementById('contactMobile').value.trim();
  const email = document.getElementById('contactEmail').value.trim();
  const message = document.getElementById('contactMessage').value.trim();

  if (!name || !mobile || !email || !message) {
    alert("Please fill in all fields.");
    return;
  }

  emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", {
    from_name: name,
    mobile: mobile,
    reply_to: email,
    message: message
  }).then(
    () => {
      alert("Message sent successfully!");
      closeContactPopup();
      document.getElementById('contactName').value = "";
      document.getElementById('contactMobile').value = "";
      document.getElementById('contactEmail').value = "";
      document.getElementById('contactMessage').value = "";
    },
    () => {
      alert("Failed to send. Try again.");
    }
  );
}
