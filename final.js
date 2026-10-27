
const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d");
const button = document.getElementById("celebrate");
const song = document.getElementById("birthdaySong");
const cake = document.getElementById("cake");
const musicToggle = document.getElementById("musicToggle");

// Replace this with your real Formspree endpoint.
const FORM_ENDPOINT = "https://formspree.io/f/mrpedjop";;

// Birthday wish elements
const wishArea = document.getElementById("wishArea");
const wishForm = document.getElementById("wishForm");
const wishInput = document.getElementById("wishInput");
const saveWish = document.getElementById("saveWish");
const saveStatus = document.getElementById("saveStatus");

let particles = [];
let animationFrame;
let celebrating = false;
let wishOpened = false;

// Canvas setup
function resizeCanvas() {
  canvas.width = window.innerWidth * devicePixelRatio;
  canvas.height = window.innerHeight * devicePixelRatio;

  canvas.style.width = window.innerWidth + "px";
  canvas.style.height = window.innerHeight + "px";

  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Confetti
function createConfetti() {
  const colors = [
    "#f8c8dc", "#ffd166", "#cdb4db",
    "#ff6b8a", "#ffffff", "#bde0fe",
    "#e9c46a"
  ];

  particles = Array.from({ length: 220 }, () => ({
    x: Math.random() * window.innerWidth,
    y: -Math.random() * window.innerHeight,
    size: Math.random() * 7 + 4,
    color: colors[Math.floor(Math.random() * colors.length)],
    speedY: Math.random() * 3 + 2,
    speedX: Math.random() * 2 - 1,
    rotation: Math.random() * 360,
    rotationSpeed: Math.random() * 8 - 4
  }));
}

function animateConfetti() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  particles.forEach((p) => {
    p.x += p.speedX;
    p.y += p.speedY;
    p.rotation += p.rotationSpeed;

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation * Math.PI / 180);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.65);
    ctx.restore();

    if (p.y > window.innerHeight + 20) {
      p.y = -20;
      p.x = Math.random() * window.innerWidth;
    }

    if (p.x < -20) p.x = window.innerWidth + 20;
    if (p.x > window.innerWidth + 20) p.x = -20;
  });

  animationFrame = requestAnimationFrame(animateConfetti);
}

// Music controls
if (song && musicToggle) {
  song.addEventListener("play", () => {
    musicToggle.hidden = false;
    musicToggle.textContent = "⏸ Pause Music";
  });

  song.addEventListener("pause", () => {
    musicToggle.textContent = "▶ Play Music";
  });

  musicToggle.addEventListener("click", async () => {
    if (wishOpened) return;

    if (song.paused) {
      try {
        await song.play();
      } catch (error) {
        console.log("Unable to play the birthday song.");
      }
    } else {
      song.pause();
    }
  });
}

// Make a Birthday Wish button
button.addEventListener("click", async () => {
  // First click: start the birthday celebration.
  if (!celebrating) {
    celebrating = true;

    button.textContent = "🎂 Make a Birthday Wish! ♡";

    if (cake) {
      cake.classList.add("cake-celebrating");
    }

    createConfetti();
    animateConfetti();

    try {
      if (song) {
        song.currentTime = 0;
        await song.play();
      }
    } catch (error) {
      console.log("Check assets/nastelbom-happy-birthday-495860.mp3 and try again.");
    }

    return;
  }

  // Second click: stop music and reveal the wish form.
  if (wishOpened) return;
  wishOpened = true;

  if (song) {
    song.pause();
    song.currentTime = 0;
  }

  if (musicToggle) {
    musicToggle.hidden = true;
  }

  const flame = document.querySelector(".flame");
  if (flame) {
    flame.classList.add("flame-out");
  }

  button.hidden = true;

  if (wishArea) {
    wishArea.hidden = false;
    wishArea.classList.add("wish-reveal");

    wishArea.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  }
});

// Submit his own wish to Formspree
if (wishForm && wishInput && saveWish && saveStatus) {
  wishForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const message = wishInput.value.trim();

    if (!message) {
      saveStatus.textContent = "Write your wish first ♡";
      return;
    }

    if (message.length > 1500) {
      saveStatus.textContent =
        "Please keep your wish under 1500 characters.";
      return;
    }

   if (!FORM_ENDPOINT.startsWith("https://formspree.io/f/")) {
  saveStatus.textContent =
    "Please add your Formspree endpoint in js/final.js.";
  return;
}

    saveWish.disabled = true;
    saveStatus.textContent = "Saving your wish... ♡";

    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: "POST",
        body: new FormData(wishForm),
        headers: {
          Accept: "application/json"
        }
      });

      if (!response.ok) {
        throw new Error("Formspree submission failed");
      }

      saveStatus.textContent =
        "Your wish has been saved.♡ ";

      wishInput.disabled = true;
      saveWish.textContent = "Wish Saved ♡";
    } catch (error) {
      saveStatus.textContent =
        "Your wish could not be sent. Check your connection and try again.";
    } finally {
      saveWish.disabled = false;
    }
  });
}
