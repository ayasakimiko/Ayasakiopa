const userId = "626071745576828955";

// Unique Visit Counter
document.addEventListener("DOMContentLoaded", () => {
  const visitKey = "hasVisited";
  const viewEl = document.getElementById("views-count");

  if (!localStorage.getItem(visitKey)) {
    let count = parseInt(localStorage.getItem("uniqueVisitCount")) || 0;
    count++;
    localStorage.setItem("uniqueVisitCount", count);
    localStorage.setItem(visitKey, "true");
    if (viewEl) viewEl.textContent = count;
  } else {
    const count = parseInt(localStorage.getItem("uniqueVisitCount")) || 0;
    if (viewEl) viewEl.textContent = count;
  }

  // Audio Controls Setup
  const audio = document.getElementById('bg-music');
  const volumeIcon = document.getElementById('volume-icon');
  const volumeRange = document.getElementById('volume-range');

  if (audio && volumeIcon && volumeRange) {
    let isPlaying = false;
    audio.volume = volumeRange.value / 100;

    volumeIcon.addEventListener('click', () => {
      if (isPlaying) {
        audio.pause();
        volumeIcon.classList.replace('fa-volume-up', 'fa-volume-mute');
      } else {
        audio.play();
        volumeIcon.classList.replace('fa-volume-mute', 'fa-volume-up');
      }
      isPlaying = !isPlaying;
    });

    volumeRange.addEventListener('input', () => {
      audio.volume = volumeRange.value / 100;
    });

    audio.play().then(() => {
      isPlaying = true;
      volumeIcon.classList.replace('fa-volume-mute', 'fa-volume-up');
    }).catch(err => {
      console.warn("Autoplay blocked:", err);
      isPlaying = false;
    });
  }
});

// Discord Presence via Lanyard WebSocket
const statusEmojiMap = {
  online: "🟢",
  idle: "🌙",
  dnd: "⛔",
  offline: "⚫"
};

const statusTextMap = {
  online: "Online",
  idle: "Idle",
  dnd: "ห้ามรบกวน",
  offline: "Offline"
};

const ws = new WebSocket("wss://api.lanyard.rest/socket");

ws.addEventListener("open", () => {
  ws.send(JSON.stringify({
    op: 2,
    d: { subscribe_to_id: userId }
  }));
});

ws.addEventListener("message", (event) => {
  let data;
  try {
    data = JSON.parse(event.data);
  } catch (err) {
    console.error("WebSocket JSON error:", err);
    return;
  }

  const { t, d } = data;
  if (!d || (t !== "INIT_STATE" && t !== "PRESENCE_UPDATE")) return;

  const user = d.discord_user;
  if (!user) return;

  const avatarUrl = user.avatar
    ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.webp?size=128`
    : `https://cdn.discordapp.com/embed/avatars/${parseInt(user.discriminator) % 5}.png`;

  const status = d.discord_status || "offline";
  const activities = d.activities || [];
  const customStatus = activities.find(a => a.type === 4);
  const game = activities.find(a => a.type === 0);
  const spotify = activities.find(a => a.name === "Spotify");

  let activityLabel = statusTextMap[status] || "Unknown";
  let activityDetail = "";
  let fullActivityText = "";

  if (customStatus?.state) {
    activityLabel = "💬 Status";
    activityDetail = customStatus.state;
    fullActivityText = `💬: ${customStatus.state}`;
  } else if (game) {
    activityLabel = "🎮 Playing";
    activityDetail = game.name || game.details || "Game";
    fullActivityText = `🎮: ${activityDetail}`;
  } else if (spotify) {
    activityLabel = "🎵 Listening";
    activityDetail = `${spotify.details} - ${spotify.state}`;
    fullActivityText = `🎵: ${activityDetail}`;
  } else {
    fullActivityText = statusTextMap[status] || "ไม่มีสถานะ";
  }
const profile = document.querySelector('.profile-center');
const maxAngle = 20;
const deadZoneSizeX = window.innerWidth / 6;  // กำหนด dead zone กว้างประมาณ 1/3 ของครึ่งจอแนวนอน
const deadZoneSizeY = window.innerHeight / 6; // กำหนด dead zone สูงประมาณ 1/3 ของครึ่งจอแนวตั้ง
let timeoutId;

window.addEventListener('mousemove', (e) => {
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;

  const deltaX = e.clientX - centerX;
  const deltaY = e.clientY - centerY;

  // ถ้าเม้าส์อยู่ใน dead zone ให้นิ่งเลย
  if (Math.abs(deltaX) < deadZoneSizeX && Math.abs(deltaY) < deadZoneSizeY) {
    profile.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
  } else {
    // หมุนตามเม้าส์เมื่ออยู่นอก dead zone
    const rotateY = (deltaX / centerX) * maxAngle * -1;
    const rotateX = (deltaY / centerY) * maxAngle;
    profile.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  }

  // เคลียร์ timeout เดิม ถ้ามี
  if (timeoutId) clearTimeout(timeoutId);

  // ตั้ง timeout ถ้าเม้าส์นิ่ง 1500ms ให้รีเซ็ตการหมุน
  timeoutId = setTimeout(() => {
    profile.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
  }, 1000);
});
window.addEventListener('load', () => {
  const bgMusic = document.getElementById('bg-music');
  
  // พยายามเล่นเพลงทันทีเมื่อโหลดเสร็จ
  bgMusic.play().catch(() => {
    // ถ้า autoplay ถูกบล็อก อาจแสดง UI ให้ user กดเล่น
    console.log('Autoplay was prevented.');
  });
});
window.addEventListener('load', () => {
  const loader = document.getElementById('loading-screen');
  const mainContent = document.querySelector('.profile-center');
  const topControls = document.querySelector('.top-controls');
  const bgMusic = document.getElementById('bg-music');
  const enterButton = document.getElementById('enter-button');
  const volumeRange = document.getElementById('volume-range');
  const volumeIcon = document.getElementById('volume-icon');

  // ปรับ volume เริ่มต้น
  bgMusic.volume = volumeRange.value / 100;

  // เมื่อกด "เข้าสู่เว็บไซต์"
  enterButton.addEventListener('click', () => {
    loader.classList.add('hidden');
    mainContent.classList.add('visible');
    topControls.classList.add('visible');

    bgMusic.play().catch(() => {
      console.log('Autoplay ถูกบล็อก');
    });
  });

  // volume slider
  volumeRange.addEventListener('input', () => {
    bgMusic.volume = volumeRange.value / 100;
    if (bgMusic.volume === 0) {
      volumeIcon.className = 'fas fa-volume-mute';
    } else if (bgMusic.volume <= 0.5) {
      volumeIcon.className = 'fas fa-volume-down';
    } else {
      volumeIcon.className = 'fas fa-volume-up';
    }
  });

  volumeIcon.addEventListener('click', () => {
    if (bgMusic.volume > 0) {
      bgMusic.volume = 0;
      volumeRange.value = 0;
      volumeIcon.className = 'fas fa-volume-mute';
    } else {
      bgMusic.volume = 0.5;
      volumeRange.value = 50;
      volumeIcon.className = 'fas fa-volume-down';
    }
  });

  // รอให้กดปุ่มเริ่ม
  startBtn.addEventListener('click', () => {
    loader.classList.add('hidden');
    mainContent.classList.add('visible');
  });
});
const loadingScreen = document.getElementById('loading-screen');
const mainContent = document.querySelector('.profile-center');
const controls = document.querySelector('.top-controls');
const bgMusic = document.getElementById('bg-music');
const volumeRange = document.getElementById('volume-range');
const volumeIcon = document.getElementById('volume-icon');

// เปลี่ยนจากจับปุ่ม มาเป็นจับคลิกที่ loading screen ทั้งหมด
loadingScreen.addEventListener('click', () => {
  loadingScreen.classList.add('hidden');
  mainContent.classList.add('visible');
  controls.style.display = 'flex';

  bgMusic.volume = volumeRange.value / 100;
  bgMusic.play().catch(() => {
    alert("ไม่สามารถเล่นเพลงได้อัตโนมัติ กรุณาอนุญาตในเบราว์เซอร์ของคุณ");
  });
});
  // Update DOM elements
  const avatarEl = document.getElementById("discord-avatar");
  if (avatarEl) {
    avatarEl.src = avatarUrl;
    avatarEl.className = `avatar-main ${status}`;
  }

  const nameEl = document.getElementById("discord-name");
  if (nameEl) nameEl.textContent = user.username;

  const statusEl = document.getElementById("discord-status");
  if (statusEl) {
    statusEl.innerHTML = `<span class="status-dot ${status}"></span> ${statusEmojiMap[status] || ""} ${activityLabel}`;
  }

  const detailEl = document.getElementById("discord-activity-details");
  if (detailEl) detailEl.textContent = activityDetail;

  const miniActivityEl = document.getElementById("mini-activity");
  if (miniActivityEl) miniActivityEl.textContent = activityDetail;

  const fullStatusEl = document.getElementById("discord-activity-status");
  if (fullStatusEl) fullStatusEl.textContent = fullActivityText;

  const statusDotMini = document.getElementById("mini-status-dot");
  if (statusDotMini) statusDotMini.className = `status-dot ${status}`;
});















