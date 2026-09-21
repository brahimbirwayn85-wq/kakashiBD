
/* ==================================================
   NAVIGATION
================================================== */

const pages = document.querySelectorAll(".page");

function goTo(pageId) {
    pages.forEach(page => page.classList.remove("active"));

    const page = document.getElementById(pageId);
    if (!page) return;

    page.classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (pageId !== "intro") {
        showCelebrationToast(pageId);
    }
}

function showCelebrationToast(pageId) {
    const messages = {
        gifts: "اختر هديتك الأولى 🎁",
        message: "هذه المعايدة لك 🤍",
        game: "نشوف مهاراتك الآن 👀",
        library: "خلّينا نشوف الذكريات 📷",
        ending: "وهكذا وصلنا للنهاية 🎉"
    };

    const message = messages[pageId];
    if (!message) return;

    document.querySelector(".celebration-toast")?.remove();

    const toast = document.createElement("div");
    toast.className = "celebration-toast";
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => toast.remove(), 2200);
}

/* ==================================================
   SUBTLE PARTY DECORATION
================================================== */

const partySymbols = ["🎉", "🎈", "✨", "🎂", "🎁", "⭐", "🌸"];

function sprinkleCelebration(count = 8) {
    const container = document.getElementById("partyEmojis");
    if (!container) return;

    for (let i = 0; i < count; i++) {
        const emoji = document.createElement("div");
        emoji.className = "party-emoji";
        emoji.textContent = partySymbols[Math.floor(Math.random() * partySymbols.length)];
        emoji.style.left = `${Math.random() * 100}%`;
        emoji.style.fontSize = `${15 + Math.random() * 14}px`;
        emoji.style.animationDuration = `${3 + Math.random() * 3}s`;
        emoji.style.animationDelay = `${Math.random() * .7}s`;
        container.appendChild(emoji);

        setTimeout(() => emoji.remove(), 7000);
    }
}

function createAmbientFloater() {
    const container = document.getElementById("partyEmojis");
    if (!container) return;

    const floater = document.createElement("div");
    floater.className = "party-emoji ambient";
    floater.textContent = ["✨", "🌸", "⭐", "💖"][Math.floor(Math.random() * 4)];
    floater.style.left = `${Math.random() * 100}%`;
    floater.style.fontSize = `${16 + Math.random() * 14}px`;
    floater.style.animationDuration = `${9 + Math.random() * 6}s`;
    container.appendChild(floater);

    setTimeout(() => floater.remove(), 16000);
}

setInterval(createAmbientFloater, 2400);

/* ==================================================
   INTRO
================================================== */

const birthdayReveal = document.getElementById("birthdayReveal");
const introNavigation = document.getElementById("introNavigation");
let introRevealTimer;
let moodTimer;

function revealBirthday() {
    if (birthdayReveal.classList.contains("show")) return;

    clearTimeout(introRevealTimer);
    birthdayReveal.classList.add("show");
    document.getElementById("intro").classList.add("intro-revealed");
    introNavigation.classList.remove("hidden");
    document.querySelector(".skip-button")?.classList.add("hidden");

    const introMessages = [
        "16 سنة! 🎂",
        "يومك اليوم ✨",
        "كل عام وانت بخير 🤍",
        "الاحتفال بدأ 🎉"
    ];

    const moodEl = document.getElementById("introMood");
    let moodIndex = 0;

    if (moodEl) {
        moodEl.textContent = introMessages[0];
        clearInterval(moodTimer);
        moodTimer = setInterval(() => {
            moodIndex = (moodIndex + 1) % introMessages.length;
            moodEl.textContent = introMessages[moodIndex];
        }, 2600);
    }

    sprinkleCelebration(12);
}

introRevealTimer = setTimeout(revealBirthday, 4500);

/* ==================================================
   MUSIC
================================================== */

const music = document.getElementById("birthdayMusic");

function startBirthday() {
    if (!music) return;

    music.volume = 0.35;
    music.play().catch(() => {});

    const button = document.querySelector(".music-button");
    if (button) {
        button.textContent = "🎵 الموسيقى تعمل";
        button.classList.add("playing");
    }

    sprinkleCelebration(10);

    setTimeout(() => {
        if (button) button.style.display = "none";
    }, 1400);
}

/* ==================================================
   KAKASHI RUN
================================================== */

const gameCanvas = document.getElementById("gameCanvas");
const gameContext = gameCanvas.getContext("2d");
gameContext.imageSmoothingEnabled = false;

const GAME_WIDTH = 960;
const GAME_HEIGHT = 360;
const GROUND_Y = 292;

const PLAYER_X = 100;
const STAND_W = 72;
const STAND_H = 96;
const CROUCH_W = 78;
const CROUCH_H = 55;

let gameRunning = false;
let gameStartTime = 0;
let gameLastFrame = 0;
let gameFrameId = null;
let gameElapsed = 0;
let gameSpawnTimer = 1.1;
let touchStartY = 0;
let obstacles = [];
let lastObstacleWasHigh = false;

const playerState = {
    y: GROUND_Y - STAND_H,
    velocityY: 0,
    onGround: true,
    crouching: false
};

let bestTime = Number(localStorage.getItem("zanjoujiBestTime")) || 0;
document.getElementById("bestTime").textContent = bestTime.toFixed(1);

/*
  Pixel sprites are drawn directly in Canvas.
  No sprite image files are required.
*/
const COLORS = {
    hairLight: "#eef2f4",
    hair: "#aeb8c1",
    hairDark: "#6e7884",
    headband: "#313a45",
    metal: "#b9c2ca",
    skin: "#d9a986",
    skinLight: "#efc2a0",
    mask: "#202832",
    vest: "#596a64",
    vestDark: "#384741",
    shirt: "#202831",
    pants: "#252d35",
    boot: "#11161b",
    eye: "#d82e45",
    eyeDark: "#651928",
    white: "#ffffff",
    shuriken: "#343b44",
    shurikenLight: "#8d969f",
    ground: "#3d4148",
    leaf: "#d96b7c"
};

const kakashiSprite = [
    "......HHHH......",
    "....HHHHHHHH....",
    "...HHHHHHHHHH...",
    "..HHHHHHHHHHHH..",
    ".HHHHHGGGGGHHHH.",
    ".HHHHGGGGGGGHHH.",
    ".HHHGGKKKKGGHHH.",
    ".HHHGGKWWKGGHHH.",
    ".HHHGGKRRKGGHHH.",
    ".HHHHGGGGGGHHHH.",
    "..SSSSSSSSSSSS..",
    "..SSSSSSSSSSSS..",
    "..DDDDDDDDDDDD..",
    ".DDDDDDDDDDDDDD.",
    ".DDDDDBDDDBDDDD.",
    ".DDDDDDDDDDDDDD.",
    ".DDDDDDDDDDDDDD.",
    "..DDDDDDDDDDDD..",
    "..DDDDDDDDDDDD..",
    "...KKK....KKK...",
    "...KKK....KKK...",
    "..KKKK....KKKK.."
];

const crouchingSprite = [
    ".....HHHHHH.....",
    "...HHHHHHHHHH...",
    "..HHHGGGGGGHHH..",
    ".HHHGGKKKKGGHHH.",
    ".HHHGGKWWKGHHHH.",
    ".HHHGGKRRKGGHHH.",
    "..SSSSSSSSSSSS..",
    "..DDDDDDDDDDDD..",
    ".DDDDDBDDDBDDDD.",
    ".DDDDDDDDDDDDDD.",
    "..DDDDDDDDDDDD..",
    "...KKKKKKKKKK..."
];

function drawPixelMatrix(matrix, x, y, pixelSize, palette) {
    matrix.forEach((row, rowIndex) => {
        [...row].forEach((cell, columnIndex) => {
            const color = palette[cell];
            if (!color) return;

            gameContext.fillStyle = color;
            gameContext.fillRect(
                Math.round(x + columnIndex * pixelSize),
                Math.round(y + rowIndex * pixelSize),
                pixelSize,
                pixelSize
            );
        });
    });
}

function drawKakashi() {
    const crouching = playerState.crouching;
    const matrix = crouching ? crouchingSprite : kakashiSprite;
    const pixelSize = 4;

    const width = matrix[0].length * pixelSize;
    const height = matrix.length * pixelSize;

    const x = PLAYER_X - 6;
    const y = crouching
        ? GROUND_Y - height
        : playerState.y;

    const palette = {
        H: COLORS.hairLight,
        G: COLORS.hair,
        K: COLORS.headband,
        W: COLORS.white,
        R: COLORS.eye,
        S: COLORS.skinLight,
        D: COLORS.vest,
        B: COLORS.vestDark
    };

    /* Small shadow */
    gameContext.fillStyle = "rgba(20,20,25,.12)";
    gameContext.fillRect(PLAYER_X + 5, GROUND_Y + 5, 64, 7);

    drawPixelMatrix(matrix, x, y, pixelSize, palette);

    /* Red Sharingan detail */
    gameContext.fillStyle = COLORS.eyeDark;
    gameContext.fillRect(x + 33, y + 31, 4, 4);

    return { x, y, width, height };
}

function drawShuriken(x, y, scale = 4) {
    gameContext.save();
    gameContext.translate(Math.round(x), Math.round(y));

    gameContext.fillStyle = COLORS.shuriken;
    gameContext.beginPath();
    gameContext.moveTo(0, -13 * scale);
    gameContext.lineTo(5 * scale, -5 * scale);
    gameContext.lineTo(13 * scale, 0);
    gameContext.lineTo(5 * scale, 5 * scale);
    gameContext.lineTo(0, 13 * scale);
    gameContext.lineTo(-5 * scale, 5 * scale);
    gameContext.lineTo(-13 * scale, 0);
    gameContext.lineTo(-5 * scale, -5 * scale);
    gameContext.closePath();
    gameContext.fill();

    gameContext.fillStyle = COLORS.shurikenLight;
    gameContext.fillRect(-3 * scale, -3 * scale, 6 * scale, 6 * scale);

    gameContext.restore();
}

function drawBackground() {
    gameContext.fillStyle = "#fbfbfc";
    gameContext.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    /* Soft sky bands */
    gameContext.fillStyle = "#f6f1f2";
    gameContext.fillRect(0, 0, GAME_WIDTH, 3);

    gameContext.fillStyle = "#f2e5e8";
    for (let x = -20; x < GAME_WIDTH; x += 130) {
        gameContext.fillRect(x, 58, 35, 2);
        gameContext.fillRect(x + 15, 54, 20, 2);
    }

    /* Distant rooftops */
    gameContext.fillStyle = "#f0ecee";
    for (let x = 0; x < GAME_WIDTH; x += 120) {
        gameContext.fillRect(x + 15, 240, 70, 52);
        gameContext.fillRect(x + 5, 250, 90, 42);
        gameContext.fillRect(x + 30, 224, 38, 16);
    }

    /* Little leaves */
    gameContext.fillStyle = COLORS.leaf;
    for (let i = 0; i < 9; i++) {
        const x = 40 + i * 113;
        const y = 35 + ((i * 37) % 75);
        gameContext.fillRect(x, y, 5, 5);
        gameContext.fillRect(x + 5, y - 4, 5, 5);
    }

    /* Ground */
    gameContext.fillStyle = COLORS.ground;
    gameContext.fillRect(0, GROUND_Y, GAME_WIDTH, 3);

    gameContext.fillStyle = "#cfd0d4";
    for (let x = 0; x < GAME_WIDTH; x += 28) {
        gameContext.fillRect(x, GROUND_Y + 10, 13, 2);
    }
}

function spawnObstacle() {
    const high = gameElapsed > 3 && Math.random() < 0.34;

    const obstacle = {
        x: GAME_WIDTH + 50,
        high,
        size: 18,
        rotation: 0
    };

    obstacle.y = high
        ? GROUND_Y - 92
        : GROUND_Y - 30;

    obstacles.push(obstacle);
    lastObstacleWasHigh = high;
}

function getPlayerHitbox() {
    if (playerState.crouching) {
        return {
            x: PLAYER_X + 8,
            y: GROUND_Y - CROUCH_H + 8,
            width: CROUCH_W - 16,
            height: CROUCH_H - 12
        };
    }

    return {
        x: PLAYER_X + 10,
        y: playerState.y + 10,
        width: STAND_W - 20,
        height: STAND_H - 16
    };
}

function getObstacleHitbox(obstacle) {
    return {
        x: obstacle.x - 17,
        y: obstacle.y - 17,
        width: 34,
        height: 34
    };
}

function checkCollision() {
    const player = getPlayerHitbox();

    return obstacles.some(obstacle => {
        const o = getObstacleHitbox(obstacle);

        return player.x < o.x + o.width &&
            player.x + player.width > o.x &&
            player.y < o.y + o.height &&
            player.y + player.height > o.y;
    });
}

function updateGame(delta) {
    gameElapsed = (performance.now() - gameStartTime) / 1000;

    playerState.velocityY += 1250 * delta;
    playerState.y += playerState.velocityY * delta;

    if (playerState.y >= GROUND_Y - STAND_H) {
        playerState.y = GROUND_Y - STAND_H;
        playerState.velocityY = 0;
        playerState.onGround = true;
    }

    const speed = 300 + Math.min(gameElapsed * 16, 280);

    gameSpawnTimer -= delta;

    if (gameSpawnTimer <= 0) {
        spawnObstacle();

        const minimumGap = Math.max(0.63, 1.05 - gameElapsed * 0.008);
        gameSpawnTimer = minimumGap + Math.random() * 0.42;
    }

    obstacles.forEach(obstacle => {
        obstacle.x -= speed * delta;
        obstacle.rotation += delta * 7;
    });

    obstacles = obstacles.filter(obstacle => obstacle.x > -60);
}

function drawGameScene() {
    gameContext.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    drawBackground();

    obstacles.forEach(obstacle => {
        drawShuriken(obstacle.x, obstacle.y, 2.4);
    });

    drawKakashi();
}

function resetGameState() {
    playerState.y = GROUND_Y - STAND_H;
    playerState.velocityY = 0;
    playerState.onGround = true;
    playerState.crouching = false;
    obstacles = [];
    gameElapsed = 0;
    gameSpawnTimer = 1.1;
    drawGameScene();
}

function updateGameTime() {
    document.getElementById("currentTime").textContent = gameElapsed.toFixed(1);
}

function jump() {
    if (!gameRunning || !playerState.onGround) return;

    playerState.crouching = false;
    playerState.velocityY = -520;
    playerState.onGround = false;
}

function crouch() {
    if (!gameRunning || !playerState.onGround) return;
    playerState.crouching = true;
}

function stopCrouch() {
    playerState.crouching = false;
}

/* Keyboard */
document.addEventListener("keydown", event => {
    if (event.code === "Space" || event.code === "ArrowUp") {
        event.preventDefault();
        if (!gameRunning) startGame();
        else jump();
    }

    if (event.code === "ArrowDown") {
        event.preventDefault();
        crouch();
    }
});

document.addEventListener("keyup", event => {
    if (event.code === "ArrowDown") stopCrouch();
});

/* Touch */
gameCanvas.addEventListener("touchstart", event => {
    if (!gameRunning) return;
    touchStartY = event.touches[0].clientY;
}, { passive: true });

gameCanvas.addEventListener("touchend", event => {
    if (!gameRunning) return;

    const endY = event.changedTouches[0].clientY;
    const difference = touchStartY - endY;

    if (difference > 35) {
        jump();
    } else if (difference < -35) {
        crouch();
        setTimeout(stopCrouch, 450);
    } else {
        jump();
    }
}, { passive: true });

function endGame() {
    if (!gameRunning) return;

    gameRunning = false;
    cancelAnimationFrame(gameFrameId);
    gameFrameId = null;

    const time = gameElapsed;

    document.getElementById("finalTime").textContent = time.toFixed(1);
    document.getElementById("currentTime").textContent = time.toFixed(1);
    document.getElementById("gameOver").classList.remove("hidden");

    if (time > bestTime) {
        bestTime = time;
        localStorage.setItem("zanjoujiBestTime", bestTime.toString());
        document.getElementById("bestTime").textContent = bestTime.toFixed(1);
        document.getElementById("newRecord").classList.remove("hidden");
    }
}

function startGame() {
    if (gameRunning) return;

    gameRunning = true;
    gameStartTime = performance.now();
    gameLastFrame = gameStartTime;

    document.getElementById("gameStart").classList.add("hidden");
    document.getElementById("gameOver").classList.add("hidden");
    document.getElementById("newRecord").classList.add("hidden");

    resetGameState();
    gameFrameId = requestAnimationFrame(gameLoop);
}

function restartGame() {
    startGame();
}

function gameLoop(timestamp) {
    if (!gameRunning) return;

    const delta = Math.min((timestamp - gameLastFrame) / 1000, 0.04);
    gameLastFrame = timestamp;

    updateGame(delta);
    updateGameTime();
    drawGameScene();

    if (checkCollision()) {
        endGame();
        return;
    }

    gameFrameId = requestAnimationFrame(gameLoop);
}

/* Draw a clean idle scene immediately */
resetGameState();

/* ==================================================
   LIBRARY
================================================== */

function showLibrary(type) {
    document.querySelectorAll(".library-section").forEach(section => {
        section.classList.remove("active");
    });

    document.querySelectorAll(".library-tab").forEach(tab => {
        tab.classList.remove("active");
    });

    if (type === "photos") {
        document.getElementById("photosLibrary").classList.add("active");
        document.querySelectorAll(".library-tab")[0].classList.add("active");
    } else {
        document.getElementById("videosLibrary").classList.add("active");
        document.querySelectorAll(".library-tab")[1].classList.add("active");
    }
}

/* ==================================================
   INDEXED DB
================================================== */

let database;
const loadedMediaIds = new Set();

const request = indexedDB.open("ZanjoujiBirthdayDB", 1);

request.onupgradeneeded = event => {
    database = event.target.result;

    if (!database.objectStoreNames.contains("media")) {
        database.createObjectStore("media", {
            keyPath: "id",
            autoIncrement: true
        });
    }
};

request.onsuccess = event => {
    database = event.target.result;
    loadStoredMedia();
};

request.onerror = event => {
    console.error("IndexedDB error:", event.target.error);
};

function addMedia(event, type) {
    const file = event.target.files[0];
    if (!file || !database) return;

    const valid = type === "photo"
        ? file.type.startsWith("image/")
        : file.type.startsWith("video/");

    if (!valid) {
        alert(type === "photo" ? "هذا الملف ليس صورة." : "هذا الملف ليس فيديو.");
        event.target.value = "";
        return;
    }

    const transaction = database.transaction(["media"], "readwrite");
    const store = transaction.objectStore("media");

    store.add({
        type,
        name: file.name,
        file,
        date: Date.now()
    });

    transaction.oncomplete = () => loadStoredMedia();
    event.target.value = "";
}

function loadStoredMedia() {
    if (!database) return;

    const transaction = database.transaction(["media"], "readonly");
    const store = transaction.objectStore("media");
    const mediaRequest = store.getAll();

    mediaRequest.onsuccess = () => {
        mediaRequest.result.forEach(addMediaToPage);
    };
}

function addMediaToPage(item) {
    if (loadedMediaIds.has(item.id)) return;
    loadedMediaIds.add(item.id);

    const url = URL.createObjectURL(item.file);
    const card = document.createElement("div");
    card.className = "media-card";

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-media";
    deleteButton.textContent = "×";
    deleteButton.setAttribute("aria-label", "حذف");
    deleteButton.onclick = event => {
        event.stopPropagation();
        deleteMedia(item.id);
    };
    card.appendChild(deleteButton);

    if (item.type === "photo") {
        const image = document.createElement("img");
        image.src = url;
        image.alt = item.name;
        image.onclick = () => openViewer(url, "image");
        card.appendChild(image);
        document.getElementById("photosGrid").appendChild(card);
    } else {
        const video = document.createElement("video");
        video.src = url;
        video.controls = true;
        video.preload = "metadata";
        card.appendChild(video);
        document.getElementById("videosGrid").appendChild(card);
    }
}

function deleteMedia(id) {
    if (!database) return;

    if (!confirm("حذف هذا الملف من المكتبة؟")) return;

    const transaction = database.transaction(["media"], "readwrite");
    transaction.objectStore("media").delete(id);

    transaction.oncomplete = () => {
        loadedMediaIds.delete(id);
        location.reload();
    };
}

/* ==================================================
   VIEWER
================================================== */

function openViewer(source, type) {
    const viewer = document.getElementById("mediaViewer");
    const content = document.getElementById("viewerContent");

    content.innerHTML = "";

    if (type === "image") {
        const image = document.createElement("img");
        image.src = source;
        image.alt = "عرض الصورة";
        content.appendChild(image);
    } else {
        const video = document.createElement("video");
        video.src = source;
        video.controls = true;
        video.autoplay = true;
        content.appendChild(video);
    }

    viewer.classList.add("show");
}

function closeViewer() {
    document.getElementById("mediaViewer").classList.remove("show");
    document.getElementById("viewerContent").innerHTML = "";
}

document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeViewer();
});
