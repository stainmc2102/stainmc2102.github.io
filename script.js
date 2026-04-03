// Scroll Animations Observer
let currentLanyardData = null; // Khai báo ở đầu file để tránh lỗi ReferenceError
let isBubbleManuallyHidden = false; // Trạng thái ẩn thủ công của bong bóng status

const observerOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');

            // Trigger skill bars when they scroll into view
            if (entry.target.classList.contains('skill-box')) {
                animateSkillBars(entry.target);
            }
        }
    });
}, observerOptions);

// Attach observer to all elements with fade-up class and all sections
document.querySelectorAll('.fade-up, .section').forEach((el) => {
    observer.observe(el);
});

// Function to animate skill bars 
function animateSkillBars(container) {
    const bars = container.querySelectorAll('.skill-fill');
    bars.forEach(bar => {
        const progress = bar.dataset.progress;
        if (progress) {
            setTimeout(() => {
                bar.style.width = progress + '%';
            }, 200);
        }
    });
}

// Active Nav Link updating while scrolling
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.id;
            navLinks.forEach(link => {
                link.classList.remove('active');
                const href = link.getAttribute('href');
                if (href && href.includes('#' + id)) {
                    link.classList.add('active');
                }
            });
        }
    });
}, { threshold: 0.4, rootMargin: "0px" });

sections.forEach(section => {
    navObserver.observe(section);
});

// Custom Smooth Scroll Function (Fallback for browsers/OS with smooth-scroll disabled)
function smoothScrollTo(targetSelector, duration = 500) {
    const target = document.querySelector(targetSelector);
    if (!target) return;

    const offset = 60;
    const bodyRect = document.body.getBoundingClientRect().top;
    const elementRect = target.getBoundingClientRect().top;
    const targetPosition = elementRect - bodyRect - offset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    // Easing function (easeInOutQuad)
    function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animation);
}

// Smooth scrolling for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        e.preventDefault();
        smoothScrollTo(targetId);

        // Update URL gracefully
        history.pushState(null, null, targetId);
    });
});

// Theme Toggle Logic
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const themeIcon = themeToggle.querySelector('i');

// Check for saved theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
    body.classList.add('light-theme');
    themeIcon.className = 'fas fa-sun';
}

themeToggle.addEventListener('click', () => {
    body.classList.toggle('light-theme');
    const isLight = body.classList.contains('light-theme');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    themeIcon.className = isLight ? 'fas fa-sun' : 'fas fa-moon';
});

// Language Toggle Logic
const langToggle = document.getElementById('lang-toggle');
const langText = langToggle.querySelector('.lang-text');
const translatableElements = document.querySelectorAll('[data-vi]');
const translatableTitles = document.querySelectorAll('[data-vi-title]');

let currentLang = localStorage.getItem('lang') || 'vi';

const translations = {
    vi: {
        connecting: "Đang kết nối...",
        pleaseWait: "Vui lòng đợi",
        offline: "Ngoại tuyến",
        idle: "Hiện không hoạt động",
        zzz: "Zzz...",
        online: "Online",
        players: "Trực tuyến",
        version: "Phiên bản",
        maintenance: "Máy chủ đang bảo trì",
        error: "Lỗi",
        noData: "Không thể lấy dữ liệu"
    },
    en: {
        connecting: "Connecting...",
        pleaseWait: "Please wait",
        offline: "Offline",
        idle: "Currently inactive",
        zzz: "Zzz...",
        online: "Online",
        players: "Players",
        version: "Version",
        maintenance: "Server under maintenance",
        error: "Error",
        noData: "Unable to fetch data"
    }
};

function updateLanguage(lang) {
    translatableElements.forEach(el => {
        const text = el.getAttribute(`data-${lang}`);
        if (text) {
            el.innerHTML = text;
        }
    });
    translatableTitles.forEach(el => {
        const title = el.getAttribute(`data-${lang}-title`);
        if (title) {
            el.setAttribute('title', title);
        }
    });
    langText.innerText = lang.toUpperCase();
    localStorage.setItem('lang', lang);
    currentLang = lang;
    
    // Re-init components that use static text
    initMCPing();
    if (currentLanyardData) {
        updateDiscordUI(currentLanyardData);
    }
}

// Initial language set
if (currentLang === 'en') {
    updateLanguage('en');
}

langToggle.addEventListener('click', () => {
    const nextLang = currentLang === 'vi' ? 'en' : 'vi';
    updateLanguage(nextLang);
});

// UI Toggle Logic
const uiToggle = document.getElementById('ui-toggle');
const uiIcon = uiToggle.querySelector('i');

uiToggle.addEventListener('click', () => {
    body.classList.toggle('ui-hidden');
    const isHidden = body.classList.contains('ui-hidden');
    uiIcon.className = isHidden ? 'fas fa-eye-slash' : 'fas fa-eye';
});

// Copy IP to Clipboard with Toast Notification
let toastTimeout;
window.copyIP = function (ip, element) {
    navigator.clipboard.writeText(ip).then(() => {
        // Change icon temporarily
        const icon = element.querySelector('i');
        const originalClass = icon.className;
        icon.className = 'fas fa-check text-primary';

        setTimeout(() => {
            icon.className = originalClass;
        }, 2000);

        // Show Toast Notification
        const toast = document.getElementById('toast');
        if (toast) {
            toast.classList.add('show');
            clearTimeout(toastTimeout);
            toastTimeout = setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        }
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
};

// Live Discord Presence (Lanyard API)
const DISCORD_ID = '1339221760322834494';
const BASE_BADGE_URL = "https://raw.githubusercontent.com/Debuggingss/discord-badges/master/pngs_named/";

function getBadges(flags) {
    if (!flags) return "";
    const badgeList = [];
    const FLAGS = {
        STAFF: [1 << 0, "staff.png", "Discord Staff"],
        PARTNER: [1 << 1, "partner.png", "Partnered Server Owner"],
        HYPESQUAD: [1 << 2, "hypesquad_events.png", "HypeSquad Events"],
        BUG_HUNTER_LEVEL_1: [1 << 3, "bughunter_1.png", "Discord Bug Hunter"],
        HOUSE_BRAVERY: [1 << 6, "bravery.png", "HypeSquad Bravery"],
        HOUSE_BRILLIANCE: [1 << 7, "brilliance.png", "HypeSquad Brilliance"],
        HOUSE_BALANCE: [1 << 8, "balance.png", "HypeSquad Balance"],
        EARLY_SUPPORTER: [1 << 9, "early_supporter.png", "Early Supporter"],
        BUG_HUNTER_LEVEL_2: [1 << 14, "bughunter_2.png", "Discord Bug Hunter Level 2"],
        ACTIVE_DEVELOPER: [1 << 22, "developer.png", "Active Developer"]
    };

    for (const key in FLAGS) {
        if ((flags & FLAGS[key][0]) === FLAGS[key][0]) {
            badgeList.push(`<img class="badge" src="${BASE_BADGE_URL}${FLAGS[key][1]}" alt="${FLAGS[key][2]}" title="${FLAGS[key][2]}" onerror="this.style.display='none'">`);
        }
    }
    return badgeList.join("");
}

function updateDiscordUI(data) {
    if (!data) return;
    currentLanyardData = data; // Lưu trữ dữ liệu mới nhất
    const user = data.discord_user;

    // Name & Discriminator
    document.getElementById('lanyard-username').innerText = user.global_name || user.username;
    const disc = user.discriminator;
    document.getElementById('lanyard-discriminator').innerText = (disc && disc !== "0") ? `#${disc}` : "";

    // Badges
    let badgesHTML = getBadges(user.public_flags);
    const isAnimated = user.avatar && user.avatar.startsWith('a_');
    if (isAnimated && !badgesHTML.includes('nitro.png')) {
        badgesHTML += `<img class="badge" src="${BASE_BADGE_URL}nitro.png" alt="Nitro" title="Nitro" onerror="this.style.display='none'">`;
    }
    if (badgesHTML === "") {
        badgesHTML = `<i class="fab fa-discord" title="Discord User" style="color: #5865F2; font-size: 1.1rem;"></i>`;
    }
    document.getElementById('lanyard-badges').innerHTML = badgesHTML;

    // Avatar
    const avatarExt = isAnimated ? 'gif' : 'webp';
    const avatarUrl = user.avatar
        ? `https://cdn.discordapp.com/avatars/${DISCORD_ID}/${user.avatar}.${avatarExt}?size=160`
        : `https://ui-avatars.com/api/?name=${user.username}&background=0D1117&color=10B981`;
    document.getElementById('lanyard-avatar').src = avatarUrl;

    // Decoration
    const decor = document.getElementById('lanyard-decoration');
    if (user.avatar_decoration_data) {
        decor.src = `https://cdn.discordapp.com/avatar-decoration-presets/${user.avatar_decoration_data.asset}.png`;
        decor.style.display = 'block';
    } else {
        decor.style.display = 'none';
    }

    // Status
    document.getElementById('lanyard-status').className = `discord-status-dot ${data.discord_status}`;

    // Activity
    const acts = data.activities || [];
    const activityEl = document.getElementById('lanyard-activity');
    const detailsEl = document.getElementById('lanyard-details');
    const icon = document.getElementById('lanyard-act-icon');
    const bubble = document.getElementById('lanyard-status-bubble');

    const gameAct = acts.find(a => a.type === 0);
    const customAct = acts.find(a => a.type === 4);

    // Update Status Bubble
    if (customAct && customAct.state && data.discord_status !== 'offline') {
        const emojiStr = customAct.emoji ? (customAct.emoji.id ? `<img src="https://cdn.discordapp.com/emojis/${customAct.emoji.id}.${customAct.emoji.animated ? 'gif' : 'png'}" style="width:16px; height:16px; vertical-align:middle; margin-right:4px;">` : customAct.emoji.name + ' ') : '';
        bubble.innerHTML = emojiStr + customAct.state;
        if (!isBubbleManuallyHidden) {
            bubble.classList.add('show');
        } else {
            bubble.classList.remove('show');
        }
    } else {
        bubble.classList.remove('show');
    }

    let mainAct = gameAct || acts[0];

    if (mainAct) {
        if (mainAct.type === 4 && !gameAct) {
            activityEl.innerHTML = `${mainAct.emoji && mainAct.emoji.name ? mainAct.emoji.name + ' ' : ''}${mainAct.state || 'Custom Status'}`;
            detailsEl.innerText = "";
        } else {
            activityEl.innerText = mainAct.name;
            detailsEl.innerText = mainAct.details || mainAct.state || "";
        }

        if (mainAct.assets && mainAct.assets.large_image) {
            let imgId = mainAct.assets.large_image;
            icon.src = imgId.startsWith("mp:external")
                ? imgId.replace(/mp:external\/.*\/https\//, "https://")
                : `https://cdn.discordapp.com/app-assets/${mainAct.application_id}/${imgId}.png`;
            icon.style.display = 'block';
        } else {
            icon.style.display = 'none';
        }
    } else {
        const t = translations[currentLang];
        activityEl.innerText = data.discord_status === 'offline' ? t.offline : t.idle;
        detailsEl.innerText = data.discord_status === 'offline' ? "" : t.zzz;
        icon.style.display = 'none';
    }
}

function connectLanyard() {
    const ws = new WebSocket('wss://api.lanyard.rest/socket');

    ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.op === 1) {
            ws.send(JSON.stringify({ op: 2, d: { subscribe_to_id: DISCORD_ID } }));
            setInterval(() => ws.send(JSON.stringify({ op: 3 })), msg.d.heartbeat_interval);
        }
        if (msg.t === 'INIT_STATE' || msg.t === 'PRESENCE_UPDATE') {
            updateDiscordUI(msg.d);
        }
    };

    ws.onclose = () => {
        setTimeout(connectLanyard, 5000);
    };

    ws.onerror = (err) => {
        console.error('Lanyard WS Error:', err);
    };
}

// Live MC Server Ping (mcapi.us)
async function initMCPing() {
    const pingElements = document.querySelectorAll('.mc-ping');
    const t = translations[currentLang];

    for (const el of pingElements) {
        const ip = el.getAttribute('data-ip');
        if (!ip) continue;

        try {
            // Sử dụng API nội bộ (Node.js server) thay vì mcapi.us
            const response = await fetch(`/api/ping?ip=${ip}`);
            const data = await response.json();

            if (data.online) {
                const players = data.players.now;
                const max = data.players.max;
                const version = data.server.name || 'Unknown';

                el.innerHTML = `<span style="color:var(--primary-color);">● ${t.online}</span> <span style="margin: 0 4px;">|</span> ${t.players}: ${players}/${max} <span style="margin: 0 4px;">|</span> ${t.version}: ${version}`;
            } else {
                el.innerHTML = `<span style="color:#ef4444;">● ${t.offline}</span> <span style="margin: 0 4px;">|</span> ${t.maintenance}`;
            }
        } catch (error) {
            console.error(`Error fetching ping for ${ip}:`, error);
            el.innerHTML = `<span style="color:#f59e0b;">● ${t.error}</span> <span style="margin: 0 4px;">|</span> ${t.noData}`;
        }
    }
}

async function initViewCounter() {
    const viewCountEl = document.getElementById('view-count');
    if (!viewCountEl) return;

    // KIỂM TRA SESSION: Nếu đã đếm trong tab này rồi thì không gửi yêu cầu tăng số nữa
    const hasBeenCounted = sessionStorage.getItem('page_viewed');

    try {
        // SỬ DỤNG CHÍNH API CỦA HOST (Node.js Server)
        // Nếu đã đếm rồi, chỉ lấy số hiện tại về xem thôi, không tăng thêm (dùng query ?increment=false)
        const url = hasBeenCounted ? '/api/views?increment=false' : '/api/views';
        
        const response = await fetch(url);
        if (!response.ok) throw new Error('API sập hoặc bị chặn');
        
        const data = await response.json();
        if (data && typeof data.count === 'number') {
            viewCountEl.textContent = data.count.toLocaleString();
            
            // Đánh dấu đã đếm thành công trong phiên này để tránh tăng số khi reload
            if (!hasBeenCounted) {
                sessionStorage.setItem('page_viewed', 'true');
            }
            
            localStorage.setItem('last_known_views', data.count.toString());
            return;
        }
    } catch (err) {
        // XỬ LÝ DỰ PHÒNG KHI CÓ LỖI (Sử dụng Local Storage)
        console.warn('View counter fallback activated:', err.message);
        const fallbackValue = localStorage.getItem('last_known_views') || "0";
        viewCountEl.textContent = Number(fallbackValue.replace(/,/g, '')).toLocaleString();
    }
}

// Background Music Player Logic
function initMusicPlayer() {
    const audio = document.getElementById('bg-music');
    const toggleBtn = document.getElementById('music-toggle-btn');
    const panel = document.getElementById('music-content');
    const playPauseBtn = document.getElementById('music-play-pause');
    const volumeSlider = document.getElementById('music-volume');

    if (!audio || !toggleBtn) return;

    // Set initial volume
    audio.volume = 0.3;

    let isPanelOpen = false;
    let isPlaying = false;

    // Directly attempt autoplay with a slight delay and volume fade-in
    audio.volume = 0; // Start at 0 for fade in

    setTimeout(() => {
        audio.play().then(() => {
            isPlaying = true;
            updatePlayState();

            // Fade in volume
            let vol = 0;
            const fadeInterval = setInterval(() => {
                if (vol < 0.3) {
                    vol += 0.05;
                    audio.volume = vol;
                    volumeSlider.value = vol;
                } else {
                    clearInterval(fadeInterval);
                }
            }, 100);

        }).catch(e => {
            console.log('Autoplay prevented by browser, waiting for interaction...', e);
            // Fallback volume if autoplay fails
            audio.volume = 0.3;
            volumeSlider.value = 0.3;

            const attemptAutoPlay = () => {
                if (!isPlaying) {
                    audio.play().then(() => {
                        isPlaying = true;
                        updatePlayState();
                    }).catch(err => console.log('Autoplay prevented', err));
                }
                document.removeEventListener('click', attemptAutoPlay);
                document.removeEventListener('keydown', attemptAutoPlay);
                document.removeEventListener('scroll', attemptAutoPlay);
            };

            // Add scroll listener as another form of interaction
            document.addEventListener('click', attemptAutoPlay);
            document.addEventListener('keydown', attemptAutoPlay);
            document.addEventListener('scroll', attemptAutoPlay, { once: true });
        });
    }, 500);

    // Toggle Music Panel Visibility
    toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        panel.classList.toggle('active');
    });

    // Close panel when clicking outside
    document.addEventListener('click', (e) => {
        if (panel.classList.contains('active') && !panel.contains(e.target) && !toggleBtn.contains(e.target)) {
            panel.classList.remove('active');
        }
    });

    // Play/Pause Button inside panel
    playPauseBtn.addEventListener('click', () => {
        if (isPlaying) {
            audio.pause();
            isPlaying = false;
        } else {
            audio.play();
            isPlaying = true;
        }
        updatePlayState();
    });

    // Volume Control
    volumeSlider.addEventListener('input', (e) => {
        audio.volume = e.target.value;
    });

    function updatePlayState() {
        if (!playPauseBtn || !toggleBtn) return;
        const icon = playPauseBtn.querySelector('i');
        const btnIcon = toggleBtn.querySelector('i');

        if (isPlaying) {
            if (icon) icon.className = 'fas fa-pause';
            toggleBtn.classList.add('playing');
            if (btnIcon) btnIcon.className = 'fas fa-compact-disc fa-spin';
        } else {
            if (icon) icon.className = 'fas fa-play';
            toggleBtn.classList.remove('playing');
            if (btnIcon) btnIcon.className = 'fas fa-music';
        }
    }
}

// Initialize pings and APIs on load
document.addEventListener('DOMContentLoaded', () => {
    initMCPing();
    connectLanyard();
    initViewCounter();
    initMusicPlayer();

    // Toggle Status Bubble by clicking Avatar
    const avatarContainer = document.querySelector('.discord-avatar-container');
    const statusBubble = document.getElementById('lanyard-status-bubble');
    if (avatarContainer && statusBubble) {
        avatarContainer.addEventListener('click', () => {
            isBubbleManuallyHidden = !isBubbleManuallyHidden;
            if (isBubbleManuallyHidden) {
                statusBubble.classList.remove('show');
            } else {
                // Only show if there's actually a status to show
                if (currentLanyardData && currentLanyardData.activities) {
                    const customAct = currentLanyardData.activities.find(a => a.type === 4);
                    if (customAct && customAct.state && currentLanyardData.discord_status !== 'offline') {
                        statusBubble.classList.add('show');
                    }
                }
            }
        });
    }

    // Reload Pings Button Logic
    const reloadBtn = document.getElementById('reload-pings');
    if (reloadBtn) {
        reloadBtn.addEventListener('click', async () => {
            if (reloadBtn.classList.contains('loading')) return;
            
            reloadBtn.classList.add('loading');
            await initMCPing();
            
            // Thêm hiệu ứng hoàn thành
            setTimeout(() => {
                reloadBtn.classList.remove('loading');
                // Optional: show toast
                const toast = document.getElementById('toast');
                if (toast) {
                    const originalText = toast.innerHTML;
                    const lang = currentLang;
                    toast.innerHTML = lang === 'vi' ? 'Đã cập nhật trạng thái!' : 'Status updated!';
                    toast.classList.add('show');
                    setTimeout(() => {
                        toast.classList.remove('show');
                        setTimeout(() => { toast.innerHTML = originalText; }, 400);
                    }, 2000);
                }
            }, 600);
        });
    }
});
