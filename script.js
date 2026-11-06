const slides = [...document.querySelectorAll(".slide")];
const song = document.getElementById("birthdaySong");
const soundNote = document.getElementById("soundNote");
let current = 0;
let started = false;
let wishShown = false;
let photoIndex = 0;
let photosScattered = false;
let letterIndex = 0;

const letterParts = [
  "しおりちゃん、２２番目の誕生日ほんとにおめでとう🎊‼",
  "東京とソウルという遠く離れた場所にいるけれど、",
  "心はいつもしおりちゃんのそばにある。",
  "誰よりもしおりちゃんの誕生日を祝うよ。",
  "愛してる♡"
];

function startExperience() {
  if (started) return;
  started = true;
  slides[0].classList.add("lit");
  song.volume = 0.72;
  song.play().then(() => {
    soundNote?.classList.add("hidden");
  }).catch(() => {
    if (soundNote) soundNote.textContent = "もう一度タッチすると音楽が再生されます";
    started = false;
  });
}

function showSlide(index) {
  slides[current].classList.remove("active");
  current = index;
  slides[current].classList.add("active");
  if (current === 0 && !started) slides[0].classList.remove("lit");
}

function addPhoto() {
  const field = document.getElementById("photoField");
  const number = photoIndex + 1;
  const img = document.createElement("img");
  img.className = "memory-photo";
  img.alt = `思い出の写真 ${number}`;
  img.src = `assets/photos/photo-${String(number).padStart(2, "0")}.jpg`;
  img.onerror = () => {
    img.onerror = null;
    img.src = `assets/photos/photo-${String(number).padStart(2, "0")}.png`;
  };
  field.appendChild(img);
  requestAnimationFrame(() => img.classList.add("visible"));
  photoIndex++;
}

function scatterPhotos() {
  const imgs = [...document.querySelectorAll(".memory-photo")];
  const field = document.getElementById("photoField");
  const w = field.clientWidth, h = field.clientHeight;
  imgs.forEach((img, i) => {
    // A loose, overlapping scrapbook arrangement that remains within the screen.
    const cols = 4;
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = 13 + col * 25 + (Math.random() * 10 - 5);
    const y = 23 + row * 30 + (Math.random() * 13 - 6);
    img.style.setProperty("--x", `${Math.max(12, Math.min(88, x))}%`);
    img.style.setProperty("--y", `${Math.max(20, Math.min(80, y))}%`);
    img.style.setProperty("--rotation", `${Math.round(Math.random() * 24 - 12)}deg`);
    img.classList.add("scattered");
  });
  photosScattered = true;
}

function handleMemoriesTap() {
  if (photoIndex < 13) {
    if (photoIndex === 0 || photosScattered) {
      addPhoto();
      photosScattered = false;
    } else {
      scatterPhotos();
    }
    return;
  }
  if (!photosScattered) {
    scatterPhotos();
    return;
  }
  document.getElementById("memoryEnding").classList.remove("hidden");
  // One additional tap advances after the closing line has appeared.
  document.getElementById("memoryEnding").dataset.ready = "yes";
}

function handleLetterTap() {
  if (letterIndex < letterParts.length) {
    const p = document.createElement("p");
    p.textContent = letterParts[letterIndex++];
    document.getElementById("letterLines").appendChild(p);
    return;
  }
  document.getElementById("signature").classList.remove("hidden");
  document.getElementById("signature").dataset.ready = "yes";
}

document.getElementById("stage").addEventListener("click", (event) => {
  if (current === 0) {
    if (!started) startExperience();
    else showSlide(1);
    return;
  }
  if (current === 1) {
    if (!wishShown) {
      document.getElementById("wish").classList.remove("hidden");
      wishShown = true;
    } else showSlide(2);
    return;
  }
  if (current === 2) {
    const ending = document.getElementById("memoryEnding");
    if (ending.dataset.ready === "yes") showSlide(3);
    else handleMemoriesTap();
    return;
  }
  if (current === 3) {
    const signature = document.getElementById("signature");
    if (signature.dataset.ready === "yes") showSlide(4);
    else handleLetterTap();
    return;
  }
});

slides[0].classList.add("active");
