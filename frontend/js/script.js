// This Code is Written By  -- ASIM HUSAIN

let scanner = null;
let linkShortened = false;
let originalLink = "";

// QR Scanner Setup
function startQRScan(event) {
  event.stopPropagation();
  if (linkShortened) return;

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

// Stop QR Scanner
function stopQRScan() {
  if (scanner) {
    scanner.stop().then(() => {
      document.getElementById('qrScanner').style.display = 'none';
      document.getElementById('qrScanIcon').style.display = linkShortened ? 'none' : 'block';
    }).catch(console.error);
  }
}

// Show QR Options (Download, Share)
function showQROptions() {
  document.getElementById('qrScanIcon').style.display = 'none';
  document.getElementById('qrCodeIcon').style.display = 'none';
  document.getElementById('qrIcons').style.display = 'flex';
}

// Hide QR Options when clicking outside
document.addEventListener('click', e => {
  const container = document.getElementById('qrContainer');
  if (!container.contains(e.target)) {
    document.getElementById('qrIcons').style.display = 'none';
    if (linkShortened) {
      document.getElementById('qrCodeIcon').style.display = 'block';
    }
  }
});

// Download QR Code
function downloadQR() {
  const text = document.getElementById("urlInput").value;
  if (!text.trim()) {
    alert("Please enter a URL.");
    return;
  }

  const canvas = document.createElement("canvas");
  const size = 256;
  canvas.width = size;
  canvas.height = size;

  const qr = new QRious({
    element: canvas,
    value: text,
    size: size,
    background: '#ffffff',
    foreground: '#000000'
  });

  const link = document.createElement('a');
  link.href = canvas.toDataURL("image/png");
  link.download = "qr-code.png";
  link.click();
}

// Share QR (Mobile)
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

// Shorten Link Logic
async function shortenLink() {
  const inputBox = document.getElementById("urlInput");
  const url = inputBox.value.trim();
  if (!url) return;

  originalLink = url;

  const res = await fetch("https://tinyurl-qc0z.onrender.com/shorten", {  // Paste Backend Link here ...
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ originalUrl: url }),
  });

  const data = await res.json();
  inputBox.value = data.shortUrl;

  linkShortened = true;

  document.getElementById('qrScanIcon').style.display = 'none';
  document.getElementById('qrIcons').style.display = 'none';
  document.getElementById('qrCodeIcon').style.display = 'block';
  document.getElementById('copyWrapper').style.display = 'flex';
  document.getElementById('backArrow').style.display = 'block';
}

// Restore Original URL
function restoreOriginal() {
  document.getElementById("urlInput").value = originalLink;
  linkShortened = false;

  document.getElementById("qrScanIcon").style.display = 'block';
  document.getElementById("qrCodeIcon").style.display = 'none';
  document.getElementById("qrIcons").style.display = 'none';
  document.getElementById('copyWrapper').style.display = 'none';
  document.getElementById('backArrow').style.display = 'none';
}

// Copy Shortened Link
function copyShortLink() {
  const shortUrl = document.getElementById("urlInput").value;
  navigator.clipboard.writeText(shortUrl)
    .then(() => {
      const copiedText = document.getElementById("copiedText");
      copiedText.style.opacity = "1";
      setTimeout(() => {
        copiedText.style.opacity = "0";
      }, 1500);
    })
    .catch(err => {
      console.error("Failed to copy:", err);
    });
}

// Background Animation
var canvas = document.getElementById('nokey'),
  can_w = parseInt(canvas.getAttribute('width')),
  can_h = parseInt(canvas.getAttribute('height')),
  ctx = canvas.getContext('2d');

var BALL_NUM = 45;
var ball_color = { r: 207, g: 255, b: 4 };
var R = 1.5, balls = [], alpha_f = 0.06;
var link_line_width = 0.8, dis_limit = 250;
var mouse_in = false;
var mouse_ball = { x: 0, y: 0, vx: 0, vy: 0, r: 0, type: 'mouse' };

function getRandomSpeed(pos) {
  var min = -1, max = 1;
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
function getRandomBall() {
  var pos = randomArrayItem(['top', 'right', 'bottom', 'left']);
  var [vx, vy] = getRandomSpeed(pos);
  var x, y;
  switch (pos) {
    case 'top': x = randomSidePos(can_w); y = -R; break;
    case 'right': x = can_w + R; y = randomSidePos(can_h); break;
    case 'bottom': x = randomSidePos(can_w); y = can_h + R; break;
    case 'left': x = -R; y = randomSidePos(can_h); break;
  }
  return { x, y, vx, vy, r: R, alpha: 1, phase: randomNumFrom(0, 10) };
}
function randomSidePos(length) {
  return Math.ceil(Math.random() * length);
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
function getDisOf(b1, b2) {
  let dx = b1.x - b2.x;
  let dy = b1.y - b2.y;
  return Math.sqrt(dx * dx + dy * dy);
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
  window.requestAnimationFrame(render);
}
function initBalls(num) {
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
  canvas.setAttribute('width', window.innerWidth);
  canvas.setAttribute('height', window.innerHeight);
  can_w = parseInt(canvas.getAttribute('width'));
  can_h = parseInt(canvas.getAttribute('height'));
}
window.addEventListener('resize', initCanvas);

function goMovie() {
  initCanvas();
  initBalls(BALL_NUM);
  window.requestAnimationFrame(render);
}
goMovie();

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

// Theme Toggle  ////    this part changed
function toggleTheme() {
  const body = document.body;
  const canvas = document.getElementById("nokey");
  const icon = document.getElementById("themeIcon");

  const isDark = body.classList.contains("dark");

  body.classList.toggle("dark", !isDark);
  body.classList.toggle("light", isDark);
  canvas.classList.toggle("dark", !isDark);
  canvas.classList.toggle("light", isDark);

  const themedElements = document.querySelectorAll("button, h1");
  themedElements.forEach(el => {
    el.classList.toggle("dark", !isDark);
    el.classList.toggle("light", isDark);
  });

  icon.classList.toggle("moon", isDark);
  icon.classList.toggle("sun", !isDark);
}

// Contact Popup
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

// Submit Contact Form via EmailJS
function submitContact() {
  const name = document.getElementById('contactName').value.trim();
  const mobile = document.getElementById('contactMobile').value.trim();
  const email = document.getElementById('contactEmail').value.trim();
  const message = document.getElementById('contactMessage').value.trim();
  const sendBtn = document.getElementById('contactSendBtn'); // Make sure the button has this ID

  if (!name || !mobile || !email || !message) {
    alert("Please fill in all fields.");
    return;
  }

  sendBtn.disabled = true;
  sendBtn.textContent = "Sending...";

  emailjs.send("service_cqsx379", "template_u0ioohf", {
    from_name: name,
    mobile: mobile,
    reply_to: email,
    message: message
  }).then(() => {
    sendBtn.textContent = "Sent ✓";

    // Clear form fields
    document.getElementById('contactName').value = "";
    document.getElementById('contactMobile').value = "";
    document.getElementById('contactEmail').value = "";
    document.getElementById('contactMessage').value = "";

    // Wait 3 seconds, then close popup and reset button
    setTimeout(() => {
      closeContactPopup();
      sendBtn.disabled = false;
      // sendBtn.textContent = "Send";
    }, 1000);
  }).catch((error) => {
    console.error("❌ Email sending failed:", error);
    sendBtn.disabled = false;
    sendBtn.textContent = "Send";
    alert("Failed to send message. Please try again.");
  });
}




// Terms Popup
function openTermsPopup() {
  document.getElementById("termsPopup").style.display = "block";
}

function closeTermsPopup() {
  document.getElementById("termsPopup").style.display = "none";
}