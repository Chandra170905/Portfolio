document.documentElement.classList.add("js");

const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");
const navLinks = document.querySelectorAll(".nav a[href^='#']");
const themeToggle = document.getElementById("themeToggle");
const year = document.getElementById("year");
const typingText = document.getElementById("typingText");
const revealItems = document.querySelectorAll(".reveal");
const timelineGroups = document.querySelectorAll(".timeline");
const skillFilterGroup = document.getElementById("skillFilters");
const certificateFilterGroup = document.getElementById("certificateFilters");
const sliderButtons = document.querySelectorAll(".slider-btn");
const scrollProgress = document.getElementById("scrollProgress");
const bgLayers = document.querySelectorAll(".bg-layer");
const heroPhotoWrap = document.querySelector(".hero-photo-wrap");
const heroPhotoCard = document.querySelector(".hero-photo-card");
const heroPhoto = document.querySelector(".hero-photo");
const rotatePhotoBtn = document.getElementById("rotatePhotoBtn");
const copyEmailBtn = document.getElementById("copyEmailBtn");
const copyStatus = document.getElementById("copyStatus");
const contactForm = document.getElementById("contactForm");
const contactNameInput = document.getElementById("name");
const contactEmailInput = document.getElementById("email");
const contactMessageInput = document.getElementById("message");
const hireMeBtn = document.getElementById("hireMeBtn");
const hireModal = document.getElementById("hireModal");
const hireForm = document.getElementById("hireForm");
const hireFormHint = document.getElementById("hireFormHint");
const hireName = document.getElementById("hireName");
const hireMarket = document.getElementById("hireMarket");
const hirePhone = document.getElementById("hirePhone");
const hireBudget = document.getElementById("hireBudget");
const hireRange = document.getElementById("hireRange");
const hireCurrency = document.getElementById("hireCurrency");
const hireToast = document.getElementById("hireToast");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const prefersCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
const prefersNarrowViewport = window.matchMedia("(max-width: 760px)").matches;
const networkInfo = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
const prefersSaveData = Boolean(networkInfo?.saveData);
const shouldLimitMotionWork = prefersReducedMotion || prefersCoarsePointer || prefersNarrowViewport || prefersSaveData;
const THEME_TRANSITION_MS = 420;
const CERTIFICATE_DB_NAME = "portfolio_media_v1";
const CERTIFICATE_STORE_NAME = "certificateImages";
const DEFAULT_SOCIAL_LINKS = {
    github: "https://github.com/Chandra170905",
    linkedin: "https://www.linkedin.com/in/chandra-prakash-2960553a0/"
};
const getProjectCards = () => document.querySelectorAll(".project-card");
const getSkillCategories = () => document.querySelectorAll(".skill-category");
const getCertificateCards = () => document.querySelectorAll(".cert-card");
const isPortfolioPage = Boolean(
    document.getElementById("projectGrid")
    || document.getElementById("skillsGrid")
    || document.getElementById("certificateGrid")
    || document.getElementById("aboutContentBlock")
);
const previewSearchParams = new URLSearchParams(window.location.search);
const isLocalPreviewEnvironment = window.location.protocol === "file:"
    || ["localhost", "127.0.0.1"].includes(window.location.hostname);
const shouldUseBrowserPortfolioData = isLocalPreviewEnvironment
    || previewSearchParams.get("preview") === "local";
const getBackend = () => window.PortfolioBackend || null;
const CERTIFICATE_CATEGORY_LABELS = {
    programming: "Programming",
    webdev: "Web Development",
    ai: "AI & Generative AI",
    cloud: "Cloud & Systems",
    networking: "Networking",
    security: "Security & Events",
    leadership: "Leadership"
};

const withThemeTransition = (fn) => {
    if (prefersReducedMotion) {
        fn();
        return;
    }

    document.body.classList.add("theme-transition");
    requestAnimationFrame(() => {
        fn();
        window.setTimeout(() => {
            document.body.classList.remove("theme-transition");
        }, THEME_TRANSITION_MS);
    });
};

const initPlatformLogos = () => {
    const logos = document.querySelectorAll(".platform-logo");
    if (logos.length === 0) return;

    logos.forEach((img) => {
        const wrap = img.closest(".platform-icon");
        if (!wrap) return;

        const markLoaded = () => wrap.classList.add("has-logo");

        if (img.complete && img.naturalWidth > 0) {
            markLoaded();
        } else {
            img.addEventListener("load", markLoaded, { once: true });
        }

        img.addEventListener("error", () => {
            img.remove();
        }, { once: true });
    });
};

const splitDataList = (value) => (
    value
        ? value.split("|").map((item) => item.trim()).filter(Boolean)
        : []
);

const parseStored = (key, fallback = null) => {
    try {
        return JSON.parse(localStorage.getItem(`portfolio_${key}`)) ?? fallback;
    } catch {
        return fallback;
    }
};

const saveStored = (key, value) => {
    localStorage.setItem(`portfolio_${key}`, JSON.stringify(value));
    localStorage.setItem("portfolio__meta", JSON.stringify({ updatedAt: Date.now() }));
};

const escapeHtml = (value) => String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const splitCommaList = (value) => String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const slugify = (value, fallback = "item") => {
    const slug = String(value || "")
        .toLowerCase()
        .replace(/&/g, " and ")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    return slug || fallback;
};

const getDefaultProjectImage = (project = {}) => {
    const fingerprint = `${project.title || ""} ${project.url || ""}`.toLowerCase();
    if (fingerprint.includes("friday")) return "project-preview-friday.svg";
    if (fingerprint.includes("swift")) return "project-preview-swift-movers.svg";
    if (fingerprint.includes("memory")) return "project-preview-memory.svg";
    if (fingerprint.includes("hexa")) return "project-preview-hexa.svg";
    return "";
};

const normalizeCertificateCategory = (value) => slugify(value, "general");

let certificateDbPromise = null;
const openCertificateDb = () => {
    if (certificateDbPromise) return certificateDbPromise;
    certificateDbPromise = new Promise((resolve, reject) => {
        const request = indexedDB.open(CERTIFICATE_DB_NAME, 1);
        request.onupgradeneeded = () => {
            const db = request.result;
            if (!db.objectStoreNames.contains(CERTIFICATE_STORE_NAME)) {
                db.createObjectStore(CERTIFICATE_STORE_NAME);
            }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error || new Error("Failed to open certificate database."));
    });
    return certificateDbPromise;
};

const getCertificateImage = async (id) => {
    if (!id) return null;
    const db = await openCertificateDb();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(CERTIFICATE_STORE_NAME, "readonly");
        const request = tx.objectStore(CERTIFICATE_STORE_NAME).get(id);
        request.onsuccess = () => resolve(request.result || null);
        request.onerror = () => reject(request.error || new Error("Failed to load certificate image."));
    });
};

const resolveCertificateAsset = async (item) => {
    if (item?.imageId) {
        try {
            const blob = await getCertificateImage(item.imageId);
            if (blob) {
                const objectUrl = URL.createObjectURL(blob);
                return { src: objectUrl, href: objectUrl, revoke: true };
            }
        } catch {}
    }
    const file = String(item?.file || "").trim();
    return { src: file, href: file, revoke: false };
};

const defaultProjects = () => Array.from(document.querySelectorAll("#projectGrid .project-card")).map((card, index) => ({
    id: String(index + 1),
    title: card.querySelector("h3")?.textContent?.trim() || `Project ${index + 1}`,
    description: card.querySelector("p")?.textContent?.trim() || "",
    url: card.querySelector("a[href]")?.getAttribute("href") || "",
    status: card.dataset.status || "Live",
    image: card.dataset.image || card.querySelector(".project-preview img")?.getAttribute("src") || getDefaultProjectImage({
        title: card.querySelector("h3")?.textContent?.trim(),
        url: card.querySelector("a[href]")?.getAttribute("href")
    }),
    highlights: splitDataList(card.dataset.highlights),
    stack: splitDataList(card.dataset.stack)
}));

const defaultSkills = () => Array.from(document.querySelectorAll("#skillsGrid .skill-category")).map((item, index) => ({
    id: String(index + 1),
    key: item.dataset.category || slugify(item.querySelector("h3")?.textContent || `skill-${index + 1}`),
    category: item.querySelector("h3")?.textContent?.trim() || `Skill Category ${index + 1}`,
    tags: Array.from(item.querySelectorAll(".skill-label")).map((tag) => tag.textContent.trim()).filter(Boolean)
}));

const defaultCertificates = () => Array.from(document.querySelectorAll("#certificateGrid .cert-card")).map((card, index) => ({
    id: String(index + 1),
    title: card.querySelector("h3")?.textContent?.trim() || `Certificate ${index + 1}`,
    category: normalizeCertificateCategory(card.dataset.category || "general"),
    description: card.querySelector(".cert-description")?.textContent?.trim() || "",
    file: card.querySelector("a[href]")?.getAttribute("href") || ""
}));

const defaultAbout = () => {
    const block = document.getElementById("aboutContentBlock");
    const paragraphs = block ? Array.from(block.querySelectorAll("p")) : [];
    return {
        title: block?.querySelector("h2")?.textContent?.trim() || "About Me",
        content: paragraphs[0]?.textContent?.trim() || "",
        subtitle: paragraphs.slice(1).map((item) => item.textContent.trim()).filter(Boolean).join("\n\n")
    };
};

const defaultContact = () => ({
    email: document.getElementById("contactEmailLink")?.textContent?.trim() || "chandra170905@gmail.com",
    phone: "",
    address: "",
    links: {
        github: document.getElementById("contactGithubLink")?.href || DEFAULT_SOCIAL_LINKS.github,
        linkedin: document.getElementById("contactLinkedinLink")?.href || DEFAULT_SOCIAL_LINKS.linkedin
    }
});

const defaultSite = () => ({
    brand: document.getElementById("brandName")?.textContent?.trim() || "Chandra Prakash",
    hero: {
        headline: document.getElementById("heroHeadline")?.textContent?.trim() || "Building clean, responsive, user-first web experiences.",
        intro: document.getElementById("heroIntro")?.textContent?.trim() || "I am Chandra, a",
        outro: document.getElementById("heroOutro")?.textContent?.trim() || "focused on modern UI, performance, and accessibility.",
        roles: typingRoles.slice()
    },
    stats: Array.from(document.querySelectorAll("#quickStats li")).map((item) => ({
        value: item.querySelector("strong")?.textContent?.trim() || "",
        label: item.querySelector("span")?.textContent?.trim() || ""
    })).filter((item) => item.value || item.label)
});

const ensurePortfolioData = () => {
    if (parseStored("projects") === null) saveStored("projects", defaultProjects());
    if (parseStored("skills") === null) saveStored("skills", defaultSkills());
    if (parseStored("certificates") === null) saveStored("certificates", defaultCertificates());
    if (parseStored("about") === null) saveStored("about", defaultAbout());
    if (parseStored("contact") === null) saveStored("contact", defaultContact());
    if (parseStored("site") === null) saveStored("site", defaultSite());
};

const renderAboutData = (data = parseStored("about")) => {
    const block = document.getElementById("aboutContentBlock");
    if (!data || !block) return;
    const link = block.querySelector(".pixel-link")?.outerHTML || "";
    const paragraphs = [data.content, data.subtitle]
        .flatMap((item) => String(item || "").split(/\n{2,}/))
        .map((item) => item.trim())
        .filter(Boolean);
    block.innerHTML = `<h2>${escapeHtml(data.title || "About Me")}</h2>${paragraphs.map((item) => `<p>${escapeHtml(item)}</p>`).join("")}${link}`;
};

const renderContactData = (data = parseStored("contact")) => {
    if (!data) return;
    const email = String(data.email || "").trim();
    const github = String(data.links?.github || DEFAULT_SOCIAL_LINKS.github).trim();
    const linkedin = String(data.links?.linkedin || DEFAULT_SOCIAL_LINKS.linkedin).trim();
    const emailLink = document.getElementById("contactEmailLink");
    const githubLink = document.getElementById("contactGithubLink");
    const linkedinLink = document.getElementById("contactLinkedinLink");
    const emailCta = document.getElementById("contactEmailCta");
    if (emailLink && email) { emailLink.textContent = email; emailLink.href = `mailto:${email}`; }
    if (githubLink && github) { githubLink.textContent = github.replace(/^https?:\/\//, ""); githubLink.href = github; }
    if (linkedinLink && linkedin) { linkedinLink.textContent = linkedin.replace(/^https?:\/\//, ""); linkedinLink.href = linkedin; }
    if (emailCta && email) emailCta.href = `mailto:${email}?subject=Portfolio%20Inquiry`;
    if (copyEmailBtn && email) copyEmailBtn.setAttribute("data-email", email);
    const socialLinks = document.querySelectorAll(".social-links .social-icon");
    if (socialLinks[0] && github) socialLinks[0].href = github;
    if (socialLinks[1] && linkedin) socialLinks[1].href = linkedin;
};

const renderSkillsData = (data = parseStored("skills")) => {
    const grid = document.getElementById("skillsGrid");
    if (!grid || !Array.isArray(data)) return;
    grid.innerHTML = data.map((item, index) => {
        const key = item.key || slugify(item.category, `skill-${index + 1}`);
        const tags = Array.isArray(item.tags) ? item.tags : splitCommaList(item.tags);
        return `<div class="skill-category" data-category="${escapeHtml(key)}"><h3>${escapeHtml(item.category || `Skill Category ${index + 1}`)}</h3><div class="skill-tags">${tags.map((tag) => `<span class="skill-tag"><span class="skill-icon-fallback" aria-hidden="true">${escapeHtml(tag.charAt(0).toUpperCase() || "S")}</span><span class="skill-label">${escapeHtml(tag)}</span></span>`).join("")}</div></div>`;
    }).join("");
    if (skillFilterGroup) {
        skillFilterGroup.innerHTML = ['<button class="chip active" data-filter="all" type="button">All</button>']
            .concat(data.map((item, index) => `<button class="chip" data-filter="${escapeHtml(item.key || slugify(item.category, `skill-${index + 1}`))}" type="button">${escapeHtml(item.category || `Skill Category ${index + 1}`)}</button>`))
            .join("");
    }
};

const renderCertificateFilters = (items) => {
    if (!certificateFilterGroup) return;

    const categories = Array.from(new Set(
        items
            .map((item) => normalizeCertificateCategory(item.category))
            .filter(Boolean)
    ));

    certificateFilterGroup.innerHTML = ['<button class="chip active" data-filter="all" type="button">All</button>']
        .concat(categories.map((category) => {
            const label = CERTIFICATE_CATEGORY_LABELS[category] || category.replace(/[-_]+/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
            return `<button class="chip" data-filter="${escapeHtml(category)}" type="button">${escapeHtml(label)}</button>`;
        }))
        .join("");
};

const renderProjectsData = (data = parseStored("projects")) => {
    const grid = document.getElementById("projectGrid");
    if (!grid || !Array.isArray(data)) return;
    if (data.length === 0) {
        grid.innerHTML = '<article class="project-card"><h3>No projects yet</h3><p>Add a project from the admin page and it will appear here.</p></article>';
        return;
    }

    const getProjectSiteLabel = (url, fallback) => {
        const raw = String(url || "").trim();
        if (!raw) return fallback;
        try {
            return new URL(raw).hostname.replace(/^www\./, "");
        } catch {
            return fallback;
        }
    };

    grid.innerHTML = data.map((item, index) => {
        const highlights = Array.isArray(item.highlights) ? item.highlights : splitCommaList(item.highlights);
        const stack = Array.isArray(item.stack) ? item.stack : splitCommaList(item.stack);
        const url = String(item.url || "").trim();
        const image = String(item.image || getDefaultProjectImage(item)).trim();
        const previewTitle = item.title || `Project ${index + 1}`;
        const previewLabel = getProjectSiteLabel(url, "Project Preview");
        const previewMarkup = image
            ? `<div class="project-preview project-preview-image"><img src="${escapeHtml(image)}" alt="${escapeHtml(previewTitle)} landing page preview" loading="lazy" decoding="async"><span class="project-preview-badge">Static Preview</span><span class="project-preview-site">${escapeHtml(previewLabel)}</span></div>`
            : `<div class="project-preview project-preview-fallback"><div class="project-preview-placeholder"><span class="project-preview-kicker">Static Preview</span><strong>${escapeHtml(previewTitle)}</strong><p>${escapeHtml(previewLabel)}</p></div></div>`;
        return `<article class="project-card" data-status="${escapeHtml(item.status || "Live")}" data-highlights="${escapeHtml(highlights.join("|"))}" data-stack="${escapeHtml(stack.join("|"))}" data-image="${escapeHtml(image)}"><h3>${escapeHtml(previewTitle)}</h3><p>${escapeHtml(item.description || "")}</p>${previewMarkup}<div class="project-actions">${url ? `<a class="btn btn-secondary" href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">Open Live Project</a>` : ""}</div></article>`;
    }).join("");
};

const renderCertificatesData = async (data = parseStored("certificates")) => {
    const grid = document.getElementById("certificateGrid");
    if (!grid || !Array.isArray(data)) return;
    renderCertificateFilters(data);
    if (data.length === 0) {
        grid.innerHTML = '<article class="cert-card" data-category="general"><h3>No certificates yet</h3><p class="cert-description">Add a certificate from the admin page and it will appear here.</p></article>';
        return;
    }

    const assets = await Promise.all(data.map((item) => resolveCertificateAsset(item)));
    grid.innerHTML = data.map((item, index) => {
        const asset = assets[index];
        const file = String(asset?.src || "").trim();
        const href = String(asset?.href || file).trim();
        const title = item.title || `Certificate ${index + 1}`;
        const category = normalizeCertificateCategory(item.category);
        return `<article class="cert-card" data-category="${escapeHtml(category)}"><h3>${escapeHtml(title)}</h3><p class="cert-description">${escapeHtml(item.description || "")}</p><div class="cert-preview">${file ? `<img src="${escapeHtml(file)}" alt="${escapeHtml(title)} Preview" loading="lazy">` : ""}</div>${href ? `<a class="btn btn-secondary" href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">Open Certificate</a>` : ""}</article>`;
    }).join("");
};

const initProjectCards = () => {
    const cards = getProjectCards();
    if (cards.length === 0) return;

    cards.forEach((card) => {
        card.querySelector(".project-card-head")?.remove();
        card.querySelector(".project-highlights")?.remove();
        card.querySelector(".project-stack")?.remove();

        const title = card.querySelector("h3");
        if (!title) return;

        const status = card.dataset.status || "Live";
        const highlights = splitDataList(card.dataset.highlights);
        const stack = splitDataList(card.dataset.stack);

        const header = document.createElement("div");
        header.className = "project-card-head";
        header.innerHTML = `<span class="project-status">${status}</span>`;

        card.insertBefore(header, title);

        if (highlights.length > 0) {
            const highlightWrap = document.createElement("div");
            highlightWrap.className = "project-highlights";
            highlightWrap.innerHTML = highlights
                .map((item) => `<span class="project-highlight">${item}</span>`)
                .join("");
            const preview = card.querySelector(".project-preview");
            if (preview) {
                card.insertBefore(highlightWrap, preview);
            }
        }

        if (stack.length > 0) {
            const stackWrap = document.createElement("div");
            stackWrap.className = "project-stack";
            stackWrap.innerHTML = stack
                .map((item) => `<span class="project-stack-item">${item}</span>`)
                .join("");
            const actions = card.querySelector(".project-actions");
            if (actions) {
                card.insertBefore(stackWrap, actions);
            }
        }
    });
};

const initCertificateCards = () => {
    const certificateCards = getCertificateCards();
    if (certificateCards.length === 0) return;

    certificateCards.forEach((card) => {
        card.querySelector(".cert-card-head")?.remove();
    });
};

const renderPortfolioBundle = async (bundle = {}) => {
    if (bundle.about) renderAboutData(bundle.about);
    if (bundle.contact) renderContactData(bundle.contact);
    if (Array.isArray(bundle.skills)) renderSkillsData(bundle.skills);
    if (Array.isArray(bundle.projects)) renderProjectsData(bundle.projects);
    if (Array.isArray(bundle.certificates)) await renderCertificatesData(bundle.certificates);
    if (bundle.site) {
        applySiteData(bundle.site);
    } else {
        renderQuickStats();
    }
};

const renderPortfolioContent = async () => {
    if (!isPortfolioPage) return;

    if (shouldUseBrowserPortfolioData) {
        ensurePortfolioData();
        renderAboutData();
        renderContactData();
        renderSkillsData();
        renderProjectsData();
        await renderCertificatesData();
        applySiteData();
    } else if (getBackend()?.isConfigured?.()) {
        try {
            const { data, error } = await getBackend().fetchContent();
            if (error) throw error;
            if (data) {
                await renderPortfolioBundle(data);
            } else {
                renderQuickStats();
            }
        } catch (error) {
            renderQuickStats();
            console.warn("Portfolio backend fetch failed.", error);
        }
    } else {
        renderQuickStats();
    }

    initPlatformLogos();
    initProjectCards();
    initCertificateCards();
    setupCertificatePreviewFallbacks();
    setupProjectTilt();
};

const initPacmanEgg = () => {
    const pacmanEgg = document.getElementById("pacmanEgg");
    if (!pacmanEgg) return;

    const move = () => {
        const rect = pacmanEgg.getBoundingClientRect();
        const w = rect.width || 56;
        const h = rect.height || 56;
        const margin = 16;
        const maxX = Math.max(margin, window.innerWidth - w - margin);
        const maxY = Math.max(margin, window.innerHeight - h - margin);
        const x = Math.floor(margin + Math.random() * (maxX - margin));
        const y = Math.floor(margin + Math.random() * (maxY - margin));
        pacmanEgg.style.transform = `translate(${x}px, ${y}px)`;
    };

    if (shouldLimitMotionWork) {
        move();
        return;
    }

    pacmanEgg.style.transition = "transform 3200ms linear";
    move();
    window.setInterval(move, 3400);
};

const initEasterEgg = () => {
    const trigger = document.getElementById("pacmanEgg");
    if (!trigger) return;

    const prefersReduce = prefersReducedMotion;
    const STORAGE_KEY = 'portfolio_eegg_best';
    const SCORES_KEY = 'portfolio_eegg_scores';
    const NAME_KEY = 'portfolio_eegg_name';

    const introCardHTML = () => `
        <div class="eegg-intro-grid">
            <div class="eegg-intro-spritewrap" aria-hidden="true">
                <img class="eegg-intro-sprite" src="sprite.png" alt="" loading="eager" decoding="async">
            </div>

            <div class="eegg-intro-content">
                <h2 class="eegg-title">Congrats! You found the Easter Egg.</h2>

                <div class="eegg-field" aria-label="Player name">
                    <label class="eegg-label" for="eeggNameInput">Player Name</label>
                    <div class="eegg-field-row">
                        <input class="eegg-input" id="eeggNameInput" name="playerName" maxlength="14" autocomplete="nickname" placeholder="ENTER NAME">
                        <span class="eegg-name-error" id="eeggNameError" style="display:none;">Enter your name to start.</span>
                        <span class="eegg-mini">Press <span class="eegg-kbd">Enter</span> to start</span>
                    </div>
                </div>

                <div class="eegg-meta" aria-label="Game info">
                    <span class="eegg-chip">Best: <strong id="eeggBestIntro">0</strong></span>
                    <span class="eegg-chip">Ghosts: <strong>5</strong></span>
                    <span class="eegg-chip">Speed: <strong>FAST</strong></span>
                </div>

                <div class="eegg-body">
                    <p class="eegg-sub">Eat pellets, avoid ghosts, and clear the board for a bonus.</p>

                    <div class="eegg-panels" aria-label="How to play">
                        <div class="eegg-panel">
                            <div class="eegg-panel-title">Controls</div>
                            <div class="eegg-panel-row"><span class="eegg-kbd">↑</span><span class="eegg-kbd">↓</span><span class="eegg-kbd">←</span><span class="eegg-kbd">→</span> or <span class="eegg-kbd">W</span><span class="eegg-kbd">A</span><span class="eegg-kbd">S</span><span class="eegg-kbd">D</span></div>
                            <div class="eegg-panel-row">Exit: <span class="eegg-kbd">Esc</span></div>
                            <div class="eegg-panel-row">Start: <span class="eegg-kbd">Enter</span></div>
                        </div>
                        <div class="eegg-panel">
                            <div class="eegg-panel-title">Scoring</div>
                            <div class="eegg-panel-row">Pellet: +10</div>
                            <div class="eegg-panel-row">Clear all: +200</div>
                        </div>
                    </div>

                    <div class="eegg-tip" aria-label="Tip"><span class="eegg-blink">PRESS START</span> · Don’t get cornered.</div>
                </div>

                <div class="eegg-actions">
                    <button class="eegg-btn primary" id="eeggStartBtn" type="button" disabled>Start</button>
                    <button class="eegg-btn" id="eeggCloseBtn" type="button">Back</button>
                </div>

                <div class="eegg-leader" aria-label="Leaderboard">
                    <div class="eegg-panel-title">Leaderboard</div>
                    <ol class="eegg-leader-list" id="eeggLeaderIntro"></ol>
                </div>
            </div>
        </div>
    `;

    const createOverlay = () => {
        const overlay = document.createElement('div');
        overlay.className = 'eegg-overlay';
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');
        overlay.setAttribute('aria-label', 'Easter egg game');
        overlay.innerHTML = `
            <div class="eegg-shell">
                <div class="eegg-intro" id="eeggIntro">
                    <div class="eegg-card eegg-card--intro" id="eeggCard">
                        ${introCardHTML()}
                    </div>
                </div>

                <div class="eegg-gamewrap" id="eeggGameWrap" style="display:none;">
                    <div class="eegg-hud">
                        <span>Score: <span id="eeggScore">0</span></span>
                        <span>Best: <span id="eeggBest">0</span></span>
                        <span><button class="eegg-btn" id="eeggExitBtn" type="button" style="padding:6px 10px;">Exit</button></span>
                    </div>
                    <canvas class="eegg-canvas" id="eeggCanvas" width="672" height="480"></canvas>
                </div>

                <div class="eegg-dpad" id="eeggDpad" style="display:none;">
                    <div class="col">
                        <button type="button" data-dir="up">↑</button>
                        <button type="button" data-dir="down">↓</button>
                    </div>
                    <div class="col">
                        <button type="button" data-dir="left">←</button>
                        <button type="button" data-dir="right">→</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
        return overlay;
    };

    let overlay;
    let state = 'intro'; // intro | starting | playing | over
    let raf = 0;
    let countdownRaf = 0;
    let score = 0;
    let introTimer = 0;
    let glitch = null;
    let startGateToken = 0;
    let sfxPrimed = false;
    const sfxStart = new Audio('start.mp3');
    const sfxEnd = new Audio('end.mp3');
    const sfxGlitch = new Audio('glitch.mp3');

    const playSfx = (audio) => {
        try {
            if (audio.readyState < 2) audio.load?.();
            audio.pause();
            audio.currentTime = 0;
            const p = audio.play();
            if (p && typeof p.catch === 'function') p.catch(() => {});
        } catch {}
    };

    const primeAudio = async (audio) => {
        try {
            audio.load?.();
            const prevMuted = audio.muted;
            const prevVol = audio.volume;
            audio.muted = true;
            audio.volume = 0;
            audio.pause();
            audio.currentTime = 0;
            const p = audio.play();
            if (p && typeof p.then === 'function') await p;
            audio.pause();
            audio.currentTime = 0;
            audio.muted = prevMuted;
            audio.volume = prevVol;
        } catch {}
    };

    const primeSfx = async () => {
        if (sfxPrimed) return;
        sfxPrimed = true;
        await Promise.all([primeAudio(sfxStart), primeAudio(sfxEnd), primeAudio(sfxGlitch)]);
    };

    const playSfxAndWait = (audio) => {
        return new Promise((resolve) => {
            let done = false;
            const onEnded = () => finish();
            const onError = () => finish();
            const finish = () => {
                if (done) return;
                done = true;
                try { audio.removeEventListener('ended', onEnded); } catch {}
                try { audio.removeEventListener('error', onError); } catch {}
                resolve();
            };

            try {
                if (audio.readyState < 2) audio.load?.();
                audio.loop = false;
                audio.pause();
                audio.currentTime = 0;

                audio.addEventListener('ended', onEnded);
                audio.addEventListener('error', onError);

                const p = audio.play();
                if (p && typeof p.catch === 'function') p.catch(() => finish());
            } catch {
                finish();
            }
        });
    };

    const stopCountdown = () => {
        cancelAnimationFrame(countdownRaf);
        countdownRaf = 0;
    };

    const countdownTmp = document.createElement('canvas');
    const countdownTmpCtx = countdownTmp.getContext('2d');

    const drawPixelatedCountdown = (ctx, text, t) => {
        const s = String(text);
        const tmp = countdownTmp;
        const tctx = countdownTmpCtx;

        const fontSize = 22;
        const padX = 16;
        const padY = 12;
        const font = `900 ${fontSize}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`;
        tctx.font = font;
        const w = Math.ceil(tctx.measureText(s).width) + padX * 2;
        const h = Math.ceil(fontSize * 1.1) + padY * 2;

        tmp.width = Math.max(1, w);
        tmp.height = Math.max(1, h);

        tctx.imageSmoothingEnabled = false;
        tctx.font = font;
        tctx.textAlign = 'center';
        tctx.textBaseline = 'middle';

        // Backplate
        tctx.fillStyle = 'rgba(11, 16, 32, 0.72)';
        tctx.fillRect(0, 0, tmp.width, tmp.height);

        // Outline + glow-ish shadow (kept chunky for pixel look)
        tctx.fillStyle = '#0b1020';
        for (const [dx, dy] of [[-2, 0], [2, 0], [0, -2], [0, 2], [-2, -2], [2, 2], [-2, 2], [2, -2]]) {
            tctx.fillText(s, tmp.width / 2 + dx, tmp.height / 2 + dy);
        }

        const pulse = prefersReduce ? 1 : (0.9 + 0.1 * Math.sin(t / 120));
        tctx.fillStyle = '#fef08a';
        tctx.fillText(s, tmp.width / 2, tmp.height / 2);

        const scale = 8 * pulse;
        const dw = tmp.width * scale;
        const dh = tmp.height * scale;
        const x = (ctx.canvas.width - dw) / 2;
        const y = Math.max(0, ctx.canvas.height * 0.14 - dh / 2);

        ctx.save();
        ctx.imageSmoothingEnabled = false;
        ctx.globalAlpha = 0.98;
        ctx.drawImage(tmp, x, y, dw, dh);
        ctx.restore();
    };

    sfxStart.preload = 'none';
    sfxEnd.preload = 'none';
    sfxGlitch.preload = 'none';
    sfxStart.volume = 0.75;
    sfxEnd.volume = 0.8;
    sfxGlitch.volume = 0.8;

    const stopGlitch = () => {
        if (!glitch) return;
        glitch.stop?.();
        glitch = null;
    };

    const runGlitch = (durationMs = 2000) => {
        if (prefersReduce) return Promise.resolve();

        stopGlitch();

        const canvas = document.createElement('canvas');
        canvas.className = 'eegg-glitch';
        canvas.setAttribute('aria-hidden', 'true');
        document.body.appendChild(canvas);

        const ctx = canvas.getContext('2d', { alpha: true });
        const dpr = Math.min(2, window.devicePixelRatio || 1);

        const resize = () => {
            const w = Math.max(1, window.innerWidth);
            const h = Math.max(1, window.innerHeight);
            canvas.width = Math.floor(w * dpr);
            canvas.height = Math.floor(h * dpr);
            canvas.style.width = `${w}px`;
            canvas.style.height = `${h}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };

        resize();

        const onResize = () => resize();
        window.addEventListener('resize', onResize);

        // "TV glitch" palette (black + off-white + charcoal grey)
        const palette = ['#000000', '#0a0a0a', '#111827', '#1f2937', '#e5e7eb', '#f8fafc'];
        const startT = performance.now();
        let rafId = 0;
        let stopped = false;
        const fadeMs = 650;
        let resolved = false;
        let resolveDone = () => {};

        const drawFrame = (t) => {
            if (stopped) return;
            const elapsed = t - startT;
            const w = window.innerWidth;
            const h = window.innerHeight;

            // Fade previous frames slowly for a "TV smear" feel.
            ctx.globalAlpha = 1;
            ctx.fillStyle = 'rgba(0, 0, 0, 0.24)';
            ctx.fillRect(0, 0, w, h);

            // Scanline base
            ctx.globalAlpha = 0.14;
            ctx.fillStyle = '#000000';
            for (let y = 0; y < h; y += 4) ctx.fillRect(0, y, w, 1);

            // Horizontal bands with small lateral jitter (classic TV glitch)
            ctx.globalAlpha = 0.6;
            const bands = 18;
            for (let i = 0; i < bands; i++) {
                const sh = Math.floor(Math.random() * 28) + 6;
                const sy = Math.floor(Math.random() * (h - sh));
                const dx = (Math.random() - 0.5) * 70;
                const c = palette[Math.floor(Math.random() * palette.length)];

                ctx.fillStyle = c;
                ctx.globalAlpha = 0.08 + Math.random() * 0.22;
                ctx.fillRect(0, sy, w, sh);

                ctx.globalAlpha = 0.2 + Math.random() * 0.24;
                ctx.drawImage(canvas, 0, sy, w, sh, dx, sy, w, sh);
            }

            // Off-white accent bursts
            ctx.globalAlpha = 0.16;
            const accent = Math.random() < 0.55 ? '#f8fafc' : '#e5e7eb';
            ctx.fillStyle = accent;
            for (let i = 0; i < 4; i++) {
                const sh = Math.floor(Math.random() * 18) + 4;
                const sy = Math.floor(Math.random() * (h - sh));
                ctx.fillRect(0, sy, w, sh);
            }

            ctx.globalAlpha = 1;

            if (elapsed < durationMs) {
                rafId = requestAnimationFrame(drawFrame);
            } else {
                canvas.classList.add('fade');
                if (!resolved) {
                    resolved = true;
                    window.setTimeout(() => resolveDone(), fadeMs);
                }
                window.setTimeout(() => {
                    window.removeEventListener('resize', onResize);
                    canvas.remove();
                }, fadeMs + 80);
            }
        };

        rafId = requestAnimationFrame(drawFrame);

        glitch = {
            stop: () => {
                stopped = true;
                cancelAnimationFrame(rafId);
                window.removeEventListener('resize', onResize);
                canvas.remove();
            }
        };

        return new Promise((resolve) => {
            resolveDone = resolve;
        });
    };

    const tile = 24;
    const gridW = 28;
    const gridH = 20;

    const makeMaze = () => {
        const walls = Array.from({ length: gridH }, () => Array.from({ length: gridW }, () => 0));
        for (let x = 0; x < gridW; x++) {
            walls[0][x] = 1;
            walls[gridH - 1][x] = 1;
        }
        for (let y = 0; y < gridH; y++) {
            walls[y][0] = 1;
            walls[y][gridW - 1] = 1;
        }

        const addRect = (x1, y1, x2, y2) => {
            for (let y = y1; y <= y2; y++) {
                for (let x = x1; x <= x2; x++) walls[y][x] = 1;
            }
        };

        addRect(3, 3, 6, 4);
        addRect(9, 3, 12, 4);
        addRect(15, 3, 18, 4);
        addRect(21, 3, 24, 4);
        addRect(3, 8, 5, 12);
        addRect(22, 8, 24, 12);
        addRect(10, 8, 17, 9);
        addRect(10, 13, 17, 14);
        addRect(12, 10, 15, 12);

        return walls;
    };

    const inBounds = (x, y) => x >= 0 && y >= 0 && x < gridW && y < gridH;

    const initPellets = (walls) => {
        const pellets = Array.from({ length: gridH }, () => Array.from({ length: gridW }, () => 0));
        for (let y = 1; y < gridH - 1; y++) {
            for (let x = 1; x < gridW - 1; x++) {
                if (!walls[y][x]) pellets[y][x] = 1;
            }
        }
        // Clear spawn areas
        pellets[1][1] = 0;
        pellets[1][2] = 0;
        pellets[gridH - 2][gridW - 2] = 0;
        pellets[gridH - 2][gridW - 3] = 0;
        return pellets;
    };

    const getBest = () => {
        const n = Number(localStorage.getItem(STORAGE_KEY) || 0);
        return Number.isFinite(n) ? n : 0;
    };

    const setBest = (n) => localStorage.setItem(STORAGE_KEY, String(n));

    const getSavedName = () => String(localStorage.getItem(NAME_KEY) || '').trim().slice(0, 14);

    const setSavedName = (name) => localStorage.setItem(NAME_KEY, name);

    const cleanName = (raw) => String(raw || '').replace(/[^\w\- ]+/g, '').trim().slice(0, 14);

    const readMeta = (name) => {
        try {
            const meta = document.querySelector(`meta[name="${name}"]`);
            return String(meta?.getAttribute('content') || '').trim();
        } catch {
            return '';
        }
    };

    const SUPABASE_URL = (() => {
        const url = readMeta('eegg-supabase-url');
        if (!url) return '';
        if (!/^https?:\/\//i.test(url)) return '';
        return url.replace(/\/+$/, '');
    })();

    const SUPABASE_ANON_KEY = readMeta('eegg-supabase-anon-key');
    const SUPABASE_TABLE = readMeta('eegg-supabase-table') || 'eegg_scores';

    const REMOTE_SCORES_ENDPOINT = (() => {
        const url = readMeta('eegg-scores-endpoint');
        if (!url) return '';
        if (!/^https?:\/\//i.test(url)) return '';
        return url;
    })();

    const loadScores = () => {
        try {
            const raw = localStorage.getItem(SCORES_KEY);
            const arr = JSON.parse(raw || '[]');
            if (!Array.isArray(arr)) return [];
            return arr
                .filter((x) => x && typeof x === 'object')
                .map((x) => ({
                    id: String(x.id || ''),
                    name: cleanName(x.name || 'PLAYER-1'),
                    score: Number(x.score || 0),
                    ts: Number(x.ts || 0)
                }))
                .filter((x) => x.id && x.name && Number.isFinite(x.score) && Number.isFinite(x.ts))
                .slice(0, 50);
        } catch {
            return [];
        }
    };

    const saveScores = (scores) => {
        localStorage.setItem(SCORES_KEY, JSON.stringify(scores.slice(0, 50)));
    };

    const normalizeScores = (arr) => {
        if (!Array.isArray(arr)) return [];
        return arr
            .filter((x) => x && typeof x === 'object')
            .map((x) => ({
                id: String(x.id || ''),
                name: cleanName(x.name || 'PLAYER-1'),
                score: Number(x.score || 0),
                ts: Number(x.ts || 0)
            }))
            .filter((x) => x.id && x.name && Number.isFinite(x.score) && Number.isFinite(x.ts));
    };

    const mergeScores = (a, b) => {
        const map = new Map();
        for (const e of [...a, ...b]) {
            const key = e.id || `${e.name}-${e.score}-${e.ts}`;
            if (!map.has(key)) map.set(key, e);
        }
        const out = Array.from(map.values());
        out.sort((x, y) => (y.score - x.score) || (y.ts - x.ts));
        return out.slice(0, 50);
    };

    const withTimeout = async (promise, ms = 2500) => {
        const ctrl = new AbortController();
        const to = window.setTimeout(() => ctrl.abort(), ms);
        try {
            return await promise(ctrl.signal);
        } finally {
            window.clearTimeout(to);
        }
    };

    const fetchRemoteScores = async () => {
        if (SUPABASE_URL && SUPABASE_ANON_KEY) {
            try {
                const scores = await withTimeout(async (signal) => {
                    const res = await fetch(`${SUPABASE_URL}/rest/v1/${encodeURIComponent(SUPABASE_TABLE)}?select=id,name,score,ts&order=score.desc,ts.desc&limit=50`, {
                        method: 'GET',
                        signal,
                        cache: 'no-store',
                        headers: {
                            apikey: SUPABASE_ANON_KEY,
                            authorization: `Bearer ${SUPABASE_ANON_KEY}`
                        }
                    });
                    if (!res.ok) return null;
                    const data = await res.json();
                    return normalizeScores(data);
                });
                return scores;
            } catch {
                return null;
            }
        }

        if (!REMOTE_SCORES_ENDPOINT) return null;
        try {
            const scores = await withTimeout(async (signal) => {
                const res = await fetch(REMOTE_SCORES_ENDPOINT, { method: 'GET', signal, cache: 'no-store' });
                if (!res.ok) return null;
                const data = await res.json();
                const arr = Array.isArray(data) ? data : (Array.isArray(data?.scores) ? data.scores : null);
                return normalizeScores(arr);
            });
            return scores;
        } catch {
            return null;
        }
    };

    const pushRemoteScore = async (entry) => {
        if (SUPABASE_URL && SUPABASE_ANON_KEY) {
            try {
                await withTimeout(async (signal) => {
                    await fetch(`${SUPABASE_URL}/rest/v1/${encodeURIComponent(SUPABASE_TABLE)}`, {
                        method: 'POST',
                        headers: {
                            'content-type': 'application/json',
                            apikey: SUPABASE_ANON_KEY,
                            authorization: `Bearer ${SUPABASE_ANON_KEY}`,
                            prefer: 'return=minimal'
                        },
                        body: JSON.stringify([entry]),
                        signal
                    });
                });
            } catch {}
            return;
        }

        if (!REMOTE_SCORES_ENDPOINT) return;
        try {
            await withTimeout(async (signal) => {
                await fetch(REMOTE_SCORES_ENDPOINT, {
                    method: 'POST',
                    headers: { 'content-type': 'application/json' },
                    body: JSON.stringify(entry),
                    signal
                });
            });
        } catch {}
    };

    const syncRemoteScores = async () => {
        const remote = await fetchRemoteScores();
        if (!remote || remote.length === 0) return;
        const local = loadScores();
        const merged = mergeScores(local, remote);
        saveScores(merged);
        renderIntroLeaderboard();
    };

    const getTopScores = (limit = 5) => {
        const scores = loadScores();
        scores.sort((a, b) => (b.score - a.score) || (b.ts - a.ts));
        return scores.slice(0, limit);
    };

    const renderIntroLeaderboard = () => {
        if (!overlay) return;
        const list = overlay.querySelector('#eeggLeaderIntro');
        if (!list) return;
        const entries = getTopScores(10);
        if (entries.length === 0) {
            list.innerHTML = `<li class="eegg-leader-empty">No scores yet. Be the first.</li>`;
            return;
        }
        list.innerHTML = entries.map((e, i) => `
            <li class="eegg-leader-item">
                <span class="eegg-rank">#${i + 1}</span>
                <span class="eegg-name">${e.name}</span>
                <span class="eegg-points">${e.score}</span>
            </li>
        `).join('');
    };

    const ensureIntroCard = () => {
        if (!overlay) return;
        const card = overlay.querySelector('#eeggCard');
        if (!card) return;
        card.innerHTML = introCardHTML();
        const bestNode = overlay.querySelector('#eeggBestIntro');
        if (bestNode) bestNode.textContent = String(getBest());
        const nameInput = overlay.querySelector('#eeggNameInput');
        const startBtn = overlay.querySelector('#eeggStartBtn');
        const err = overlay.querySelector('#eeggNameError');

        const sync = () => {
            if (!nameInput) return;
            const name = cleanName(nameInput.value);
            if (name !== nameInput.value) nameInput.value = name;
            const ok = Boolean(name);
            const touched = nameInput.dataset.touched === '1';
            if (startBtn) startBtn.disabled = !ok;
            if (err) err.style.display = (!ok && touched) ? '' : 'none';
            nameInput.classList.toggle('eegg-input--error', !ok && touched);
        };

        if (nameInput) {
            nameInput.value = '';
            nameInput.dataset.touched = '0';
            nameInput.addEventListener('input', sync);
            nameInput.addEventListener('blur', () => {
                nameInput.dataset.touched = '1';
                sync();
            });
            sync();
        }
        renderIntroLeaderboard();
        syncRemoteScores();
    };

    const openInstant = () => {
        if (!overlay) overlay = createOverlay();
        ensureIntroCard();
        overlay.classList.remove('slow');
        overlay.classList.remove('blackout');
        overlay.classList.remove('blackout-off');
        overlay.classList.add('open');
        overlay.classList.add('intro-show');
        document.body.style.overflow = 'hidden';
        state = 'intro';
        score = 0;
        overlay.querySelector('#eeggScore').textContent = '0';
        overlay.querySelector('#eeggBest').textContent = String(getBest());
        overlay.querySelector('#eeggIntro').style.display = '';
        overlay.querySelector('#eeggCard').style.display = 'block';
        overlay.querySelector('#eeggGameWrap').style.display = 'none';
        overlay.querySelector('#eeggDpad').style.display = 'none';
        cancelAnimationFrame(raf);
    };

    const openSequenced = async () => {
        if (!overlay) overlay = createOverlay();
        if (overlay.classList.contains('open')) return;
        wireOverlayEvents();
        ensureIntroCard();

        window.clearTimeout(introTimer);
        stopGlitch();

        if (prefersReduce) {
            openInstant();
            return;
        }

        // Run under a user gesture (opening the overlay) to reduce SFX start latency.
        await primeSfx();
        playSfx(sfxGlitch);

        // Prepare a pitch-black overlay underneath the glitch (no fade-in perceived).
        overlay.classList.add('open');
        overlay.classList.remove('slow');
        overlay.classList.add('blackout');
        overlay.classList.remove('blackout-off');
        overlay.classList.remove('intro-show');
        document.body.style.overflow = 'hidden';

        state = 'intro';
        score = 0;
        overlay.querySelector('#eeggScore').textContent = '0';
        overlay.querySelector('#eeggBest').textContent = String(getBest());
        overlay.querySelector('#eeggIntro').style.display = '';
        overlay.querySelector('#eeggCard').style.display = 'block';
        overlay.querySelector('#eeggGameWrap').style.display = 'none';
        overlay.querySelector('#eeggDpad').style.display = 'none';
        cancelAnimationFrame(raf);

        await runGlitch(2000);
        if (!overlay) return;

        // When glitch ends, fade the blackout away to reveal the intro card.
        requestAnimationFrame(() => {
            if (!overlay) return;
            overlay.classList.add('blackout-off');
        });

        introTimer = window.setTimeout(() => {
            if (!overlay) return;
            overlay.classList.add('intro-show');
            overlay.classList.remove('blackout');
            overlay.classList.remove('blackout-off');
        }, 1800);
    };

    const close = () => {
        window.clearTimeout(introTimer);
        stopGlitch();
        stopCountdown();
        startGateToken++;
        try { sfxStart.pause(); sfxStart.currentTime = 0; } catch {}
        try { sfxEnd.pause(); } catch {}
        try { sfxGlitch.pause(); } catch {}
        document.body.style.overflow = '';
        if (overlay) overlay.classList.remove('open');
        if (overlay) overlay.classList.remove('blackout');
        if (overlay) overlay.classList.remove('blackout-off');
        if (overlay) overlay.classList.remove('intro-show');
        cancelAnimationFrame(raf);
        state = 'intro';
    };

    let playerName = '';

    const showGameOver = (finalScore) => {
        state = 'over';
        cancelAnimationFrame(raf);
        window.clearTimeout(introTimer);
        playSfx(sfxEnd);
        const best = Math.max(getBest(), finalScore);
        setBest(best);

        const entry = {
            id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
            name: playerName || 'PLAYER-1',
            score: finalScore,
            ts: Date.now()
        };
        const all = loadScores();
        all.push(entry);
        all.sort((a, b) => (b.score - a.score) || (b.ts - a.ts));
        saveScores(all.slice(0, 25));
        const top = getTopScores(10);
        pushRemoteScore(entry);

        overlay.querySelector('#eeggIntro').style.display = '';
        overlay.classList.add('intro-show');
        overlay.classList.remove('slow');
        const card = overlay.querySelector('#eeggCard');
        card.innerHTML = `
            <h2 class="eegg-title">Game Over</h2>
            <p class="eegg-sub">Score: <strong>${finalScore}</strong> · Best: <strong>${best}</strong></p>
            <div class="eegg-board" aria-label="Scoreboard">
                <div class="eegg-panel-title">Scoreboard</div>
                <ol class="eegg-board-list">
                    ${top.map((e, i) => `
                        <li class="eegg-board-item ${e.id === entry.id ? 'is-you' : ''}">
                            <span class="eegg-rank">#${i + 1}</span>
                            <span class="eegg-name">${e.name}</span>
                            <span class="eegg-points">${e.score}</span>
                        </li>
                    `).join('')}
                </ol>
            </div>
            <div class="eegg-actions">
                <button class="eegg-btn primary" id="eeggPlayAgainBtn" type="button">Play Again</button>
                <button class="eegg-btn" id="eeggBackBtn" type="button">Back</button>
            </div>
        `;
        overlay.querySelector('#eeggGameWrap').style.display = 'none';
        overlay.querySelector('#eeggDpad').style.display = 'none';
        card.style.display = 'block';

        card.querySelector('#eeggPlayAgainBtn').addEventListener('click', start, { once: true });
        card.querySelector('#eeggBackBtn').addEventListener('click', () => {
            close();
            overlay.remove();
            overlay = null;
        }, { once: true });
    };

    let walls;
    let pellets;
    let pac;
    let ghosts;
    let dir = { x: 0, y: 0 }; // movement (one-tile steps)
    let nextDir = { x: 0, y: 0 }; // queued step direction
    let facing = { x: 1, y: 0 }; // for drawing even when standing still
    let lastStep = 0;

    const resetEntities = () => {
        pac = { x: 1, y: 1, px: 1 * tile, py: 1 * tile, speed: 14.5 };
        ghosts = [
            { x: gridW - 2, y: gridH - 2, px: (gridW - 2) * tile, py: (gridH - 2) * tile, speed: 8.4, color: '#fb7185' },
            { x: gridW - 2, y: 1, px: (gridW - 2) * tile, py: 1 * tile, speed: 8.1, color: '#60a5fa' },
            { x: 1, y: gridH - 2, px: 1 * tile, py: (gridH - 2) * tile, speed: 8.0, color: '#34d399' },
            { x: Math.floor(gridW / 2), y: 1, px: Math.floor(gridW / 2) * tile, py: 1 * tile, speed: 8.2, color: '#fbbf24' },
            { x: Math.floor(gridW / 2), y: gridH - 2, px: Math.floor(gridW / 2) * tile, py: (gridH - 2) * tile, speed: 8.3, color: '#a78bfa' }
        ];
        dir = { x: 0, y: 0 };
        nextDir = { x: 0, y: 0 };
        facing = { x: 1, y: 0 };
        lastStep = 0;
    };

    const canMove = (x, y) => inBounds(x, y) && !walls[y][x];

    const tryTurn = () => {
        if (!nextDir.x && !nextDir.y) return false;
        const nx = pac.x + nextDir.x;
        const ny = pac.y + nextDir.y;
        if (canMove(nx, ny)) {
            dir = { ...nextDir };
            facing = { ...nextDir };
            nextDir = { x: 0, y: 0 };
            return true;
        }
        return false;
    };

    const stepEntity = (ent, vx, vy) => {
        const tx = ent.x + vx;
        const ty = ent.y + vy;
        if (!canMove(tx, ty)) return false;
        ent.x = tx;
        ent.y = ty;
        return true;
    };

    const chooseGhostDir = (g) => {
        const options = [
            { x: 1, y: 0 },
            { x: -1, y: 0 },
            { x: 0, y: 1 },
            { x: 0, y: -1 }
        ].filter((d) => canMove(g.x + d.x, g.y + d.y));

        if (options.length === 0) return { x: 0, y: 0 };

        // Greedy towards Pacman with small randomness
        const rand = Math.random();
        if (rand < 0.26) return options[Math.floor(Math.random() * options.length)];

        options.sort((a, b) => {
            const da = Math.abs((g.x + a.x) - pac.x) + Math.abs((g.y + a.y) - pac.y);
            const db = Math.abs((g.x + b.x) - pac.x) + Math.abs((g.y + b.y) - pac.y);
            return da - db;
        });
        return options[0];
    };

    const draw = (ctx) => {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        // Maze
        ctx.fillStyle = '#0b1020';
        for (let y = 0; y < gridH; y++) {
            for (let x = 0; x < gridW; x++) {
                if (!walls[y][x]) continue;
                ctx.fillRect(x * tile, y * tile, tile, tile);
            }
        }

        // Pellets
        ctx.fillStyle = '#fef08a';
        for (let y = 0; y < gridH; y++) {
            for (let x = 0; x < gridW; x++) {
                if (!pellets[y][x]) continue;
                ctx.beginPath();
                ctx.arc(x * tile + tile / 2, y * tile + tile / 2, 3, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // Pacman
        const mouth = prefersReduce ? 0.08 : (0.18 + 0.08 * Math.sin(performance.now() / 110));
        const angle = facing.x === 1 ? 0 : facing.x === -1 ? Math.PI : facing.y === 1 ? Math.PI / 2 : -Math.PI / 2;
        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.moveTo(pac.px + tile / 2, pac.py + tile / 2);
        ctx.arc(pac.px + tile / 2, pac.py + tile / 2, tile * 0.42, angle + mouth, angle + Math.PI * 2 - mouth);
        ctx.closePath();
        ctx.fill();

        // Ghost
        ghosts.forEach((g) => {
            ctx.fillStyle = g.color;
            ctx.beginPath();
            ctx.arc(g.px + tile / 2, g.py + tile / 2, tile * 0.42, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#0b1020';
            ctx.beginPath();
            ctx.arc(g.px + tile / 2 - 5, g.py + tile / 2 - 4, 3, 0, Math.PI * 2);
            ctx.arc(g.px + tile / 2 + 5, g.py + tile / 2 - 4, 3, 0, Math.PI * 2);
            ctx.fill();
        });
    };

    const update = (ts, ctx) => {
        if (state !== 'playing') return;
        if (!lastStep) lastStep = ts;
        const dt = Math.min(32, ts - lastStep);
        lastStep = ts;

        const movePx = (ent, speed) => (speed * dt) / 1000 * tile;

        // Pacman tile snapping
        const targetX = pac.x * tile;
        const targetY = pac.y * tile;
        const atTile = Math.abs(pac.px - targetX) < 0.5 && Math.abs(pac.py - targetY) < 0.5;
        if (atTile) {
            pac.px = targetX;
            pac.py = targetY;

            // One-tile step only when user requests a direction.
            if (!dir.x && !dir.y) {
                const stepped = tryTurn();
                if (stepped) {
                    stepEntity(pac, dir.x, dir.y);
                    dir = { x: 0, y: 0 };
                }
            } else {
                // Safety: movement is step-based; don't auto-continue.
                dir = { x: 0, y: 0 };
            }
        }

        pac.px += (pac.x * tile - pac.px) * Math.min(1, movePx(pac, pac.speed) / tile);
        pac.py += (pac.y * tile - pac.py) * Math.min(1, movePx(pac, pac.speed) / tile);

        // Pellet check on tile center
        if (pellets[pac.y]?.[pac.x]) {
            pellets[pac.y][pac.x] = 0;
            score += 10;
            overlay.querySelector('#eeggScore').textContent = String(score);
        }

        // Ghosts movement: choose at tile centers
        ghosts.forEach((g) => {
            const gTargetX = g.x * tile;
            const gTargetY = g.y * tile;
            const gAtTile = Math.abs(g.px - gTargetX) < 0.5 && Math.abs(g.py - gTargetY) < 0.5;
            if (gAtTile) {
                g.px = gTargetX;
                g.py = gTargetY;
                const gd = chooseGhostDir(g);
                stepEntity(g, gd.x, gd.y);
            }
            g.px += (g.x * tile - g.px) * Math.min(1, movePx(g, g.speed) / tile);
            g.py += (g.y * tile - g.py) * Math.min(1, movePx(g, g.speed) / tile);
        });

        // Collision
        for (const g of ghosts) {
            const dx = (pac.px - g.px);
            const dy = (pac.py - g.py);
            if (Math.hypot(dx, dy) < tile * 0.52) {
                showGameOver(score);
                return;
            }
        }

        // Win (no pellets)
        let remaining = 0;
        for (let y = 0; y < gridH; y++) for (let x = 0; x < gridW; x++) remaining += pellets[y][x] ? 1 : 0;
        if (remaining === 0) showGameOver(score + 200);

        draw(ctx);
        raf = requestAnimationFrame((t) => update(t, ctx));
    };

    const start = async () => {
        if (!overlay) return;
        if (state === 'starting' || state === 'playing') return;
        await primeSfx();
        const nameInput = overlay.querySelector('#eeggNameInput');
        const err = overlay.querySelector('#eeggNameError');

        const resolvedName = (() => {
            if (nameInput) {
                const n = cleanName(nameInput.value || '');
                if (!n) return '';
                playerName = n;
                setSavedName(playerName);
                return n;
            }
            if (playerName) return playerName;
            const saved = getSavedName();
            if (saved) {
                playerName = saved;
                return saved;
            }
            return '';
        })();

        if (!resolvedName) {
            // Force back to intro to collect a name.
            ensureIntroCard();
            overlay.querySelector('#eeggIntro').style.display = '';
            overlay.querySelector('#eeggGameWrap').style.display = 'none';
            overlay.querySelector('#eeggDpad').style.display = 'none';
            overlay.classList.add('intro-show');

            const input = overlay.querySelector('#eeggNameInput');
            const error = overlay.querySelector('#eeggNameError');
            if (input) {
                input.dataset.touched = '1';
                input.classList.add('eegg-input--error');
                input.focus();
            }
            if (error) error.style.display = '';
            if (err) err.style.display = '';
            return;
        }

        const token = ++startGateToken;
        state = 'starting';
        score = 0;
        overlay.querySelector('#eeggScore').textContent = '0';
        overlay.querySelector('#eeggBest').textContent = String(getBest());

        walls = makeMaze();
        pellets = initPellets(walls);
        resetEntities();

        const intro = overlay.querySelector('#eeggIntro');
        const wrap = overlay.querySelector('#eeggGameWrap');
        const dpad = overlay.querySelector('#eeggDpad');
        intro.style.display = 'none';
        wrap.style.display = 'block';
        dpad.style.display = '';

        const canvas = overlay.querySelector('#eeggCanvas');
        const ctx = canvas.getContext('2d');
        draw(ctx);

        cancelAnimationFrame(raf);
        lastStep = 0;

        stopCountdown();

        playSfx(sfxStart);

        const tickMs = 650;
        const totalCountdownMs = tickMs * 3;
        let countdownStart = 0;

        const beginPlaying = () => {
            stopCountdown();
            if (!overlay || !overlay.classList.contains('open')) return;
            if (token !== startGateToken) return;
            if (state !== 'starting') return;

            state = 'playing';
            lastStep = 0;
            raf = requestAnimationFrame((tt) => update(tt, ctx));
        };

        const runCountdown = (t) => {
            if (!overlay || !overlay.classList.contains('open')) return;
            if (state !== 'starting') return;
            if (token !== startGateToken) return;
            if (!countdownStart) countdownStart = t;

            const elapsed = t - countdownStart;
            if (elapsed >= totalCountdownMs) {
                beginPlaying();
                return;
            }

            const step = Math.min(2, Math.floor(elapsed / tickMs)); // 0,1,2
            const n = 3 - step;

            draw(ctx);
            drawPixelatedCountdown(ctx, String(n), t);

            countdownRaf = requestAnimationFrame(runCountdown);
        };

        runCountdown(performance.now());
        countdownRaf = requestAnimationFrame(runCountdown);
    };

    const setDir = (d) => {
        if (state !== 'playing') return;
        if (d === 'up') nextDir = { x: 0, y: -1 };
        if (d === 'down') nextDir = { x: 0, y: 1 };
        if (d === 'left') nextDir = { x: -1, y: 0 };
        if (d === 'right') nextDir = { x: 1, y: 0 };
        if (nextDir.x || nextDir.y) facing = { ...nextDir };
    };

    const onKey = (e) => {
        if (!overlay || !overlay.classList.contains('open')) return;
        if (e.key === 'Escape') {
            e.preventDefault();
            close();
            return;
        }
        const nameEl = overlay.querySelector('#eeggNameInput');
        const focusOnName = nameEl && document.activeElement === nameEl;
        if (state === 'intro' && overlay.classList.contains('intro-show') && ((e.key === 'Enter') || (!focusOnName && e.key === ' '))) {
            e.preventDefault();
            start();
            return;
        }
        if (state !== 'playing') return;
        if (['ArrowUp', 'w', 'W'].includes(e.key)) setDir('up');
        if (['ArrowDown', 's', 'S'].includes(e.key)) setDir('down');
        if (['ArrowLeft', 'a', 'A'].includes(e.key)) setDir('left');
        if (['ArrowRight', 'd', 'D'].includes(e.key)) setDir('right');
    };

    const wireOverlayEvents = () => {
        if (!overlay) return;
        if (overlay.dataset.wired === '1') return;
        overlay.dataset.wired = '1';
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) close();
        });
        overlay.addEventListener('click', (e) => {
            const t = e.target;
            if (!(t instanceof Element)) return;
            if (t.id === 'eeggCloseBtn') close();
            if (t.id === 'eeggStartBtn') start();
        });
        overlay.querySelector('#eeggExitBtn')?.addEventListener('click', close);

        overlay.querySelectorAll('#eeggDpad button[data-dir]').forEach((btn) => {
            btn.addEventListener('click', () => setDir(btn.getAttribute('data-dir')));
        });
    };

    trigger.addEventListener("click", () => {
        openSequenced();
    });

    window.addEventListener('keydown', onKey);
};

initPacmanEgg();
initEasterEgg();

if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
        const expanded = menuToggle.getAttribute("aria-expanded") === "true";
        menuToggle.setAttribute("aria-expanded", String(!expanded));
        nav.classList.toggle("open");
    });
}

navLinks.forEach((link) => {
    link.addEventListener("click", () => {
        nav?.classList.remove("open");
        menuToggle?.setAttribute("aria-expanded", "false");
    });
});

const setThemeLabel = () => {
    if (!themeToggle) return;
    const isLight = document.body.classList.contains("light");
    themeToggle.setAttribute("aria-label", isLight ? "Switch to dark mode" : "Switch to light mode");
    themeToggle.setAttribute("title", isLight ? "Switch to dark mode" : "Switch to light mode");
    themeToggle.dataset.theme = isLight ? "light" : "dark";
};

const loadProjectPreview = (shell) => {
    if (!shell || shell.dataset.previewLoaded === "true") return;
    const src = shell.getAttribute("data-preview-src");
    const title = shell.getAttribute("data-preview-title") || "Project preview";
    if (!src) return;

    shell.dataset.previewLoaded = "true";
    shell.classList.add("is-loaded");
    shell.innerHTML = `<iframe src="${escapeHtml(src)}" title="${escapeHtml(title)}" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`;
};

const setupProjectPreviewToggles = () => {
    const previewShells = document.querySelectorAll(".project-preview-shell");
    if (previewShells.length === 0) return;

    previewShells.forEach((shell) => {
        if (shell.dataset.previewBound === "true") return;
        shell.dataset.previewBound = "true";
        shell.querySelector(".project-preview-toggle")?.addEventListener("click", () => {
            loadProjectPreview(shell);
        });
    });
};

const buildCertificateFallbackMarkup = (title, text, action) => `
    <div class="cert-preview-fallback" role="img" aria-label="${escapeHtml(title)} preview unavailable">
        <span class="cert-preview-fallback__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" focusable="false">
                <path d="M7 2.75h7.2L19 7.55V20a1.25 1.25 0 0 1-1.25 1.25h-10.5A1.25 1.25 0 0 1 6 20V4A1.25 1.25 0 0 1 7.25 2.75Z"></path>
                <path d="M14 2.75V8h5"></path>
                <path d="M8.5 14.25h7M8.5 17.25h7M8.5 11.25h3.5"></path>
            </svg>
        </span>
        <span class="cert-preview-fallback__text">${escapeHtml(text)}</span>
        <span class="cert-preview-fallback__action">${escapeHtml(action)}</span>
    </div>
`;

const markCertificateLinkMissing = (link) => {
    if (!link || link.dataset.missingAsset === "true") return;
    link.dataset.missingAsset = "true";
    link.removeAttribute("href");
    link.setAttribute("aria-disabled", "true");
    link.tabIndex = -1;
    link.textContent = "Certificate File Missing";
};

const setupCertificatePreviewFallbacks = () => {
    const previewFrames = document.querySelectorAll(".cert-preview iframe");
    previewFrames.forEach((frame) => {
        const preview = frame.closest(".cert-preview");
        const card = frame.closest(".cert-card");
        const openLink = card?.querySelector('a[href]');

        if (!preview || !openLink || preview.querySelector(".cert-preview-fallback")) return;

        preview.classList.add("cert-preview--pdf");
        preview.tabIndex = 0;
        preview.setAttribute("role", "link");
        preview.setAttribute("aria-label", `Open ${frame.title || "certificate"} PDF`);

        preview.addEventListener("click", (event) => {
            if (event.target.closest("a")) return;
            window.open(openLink.href, "_blank", "noopener");
        });

        preview.addEventListener("keydown", (event) => {
            if (event.key !== "Enter" && event.key !== " ") return;
            event.preventDefault();
            window.open(openLink.href, "_blank", "noopener");
        });

        const fallback = document.createElement("a");
        fallback.className = "cert-preview-fallback";
        fallback.href = openLink.href;
        fallback.target = "_blank";
        fallback.rel = "noopener noreferrer";
        fallback.setAttribute("aria-label", `Open ${frame.title || "certificate"} in a new tab`);
        fallback.innerHTML = `
            <span class="cert-preview-fallback__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" focusable="false">
                    <path d="M7 2.75h7.2L19 7.55V20a1.25 1.25 0 0 1-1.25 1.25h-10.5A1.25 1.25 0 0 1 6 20V4A1.25 1.25 0 0 1 7.25 2.75Z"></path>
                    <path d="M14 2.75V8h5"></path>
                    <path d="M8.5 14.25h7M8.5 17.25h7M8.5 11.25h3.5"></path>
                </svg>
            </span>
            <span class="cert-preview-fallback__text">Preview not available on some phones</span>
            <span class="cert-preview-fallback__action">Tap preview to open PDF</span>
        `;
        preview.appendChild(fallback);
    });

    document.querySelectorAll(".cert-preview img").forEach((img) => {
        const preview = img.closest(".cert-preview");
        const card = img.closest(".cert-card");
        const openLink = card?.querySelector(".btn");
        const title = card?.querySelector("h3")?.textContent?.trim() || img.alt || "Certificate";

        const showMissingAssetFallback = () => {
            if (!preview || preview.querySelector(".cert-preview-fallback")) return;
            preview.classList.add("cert-preview--missing");
            preview.innerHTML = buildCertificateFallbackMarkup(
                title,
                "Preview unavailable on this deployment.",
                "Add the certificate image file to the project to restore it."
            );
            markCertificateLinkMissing(openLink);
        };

        if (img.complete && img.naturalWidth === 0) {
            showMissingAssetFallback();
            return;
        }

        img.addEventListener("error", showMissingAssetFallback, { once: true });
    });

    document.querySelectorAll(".cert-card .cert-preview").forEach((preview) => {
        if (preview.querySelector("img, iframe, .cert-preview-fallback")) return;

        const card = preview.closest(".cert-card");
        const title = card?.querySelector("h3")?.textContent?.trim() || "Certificate";
        preview.classList.add("cert-preview--missing");
        preview.innerHTML = buildCertificateFallbackMarkup(
            title,
            "No certificate preview bundled.",
            shouldUseBrowserPortfolioData
                ? "Choose a certificate image in the local admin preview."
                : "Add the certificate image file to the deployed project."
        );
    });
};

const updateScrollProgress = () => {
    if (!scrollProgress) return;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? Math.min(1, Math.max(0, window.scrollY / maxScroll)) : 0;
    scrollProgress.style.transform = `scaleX(${progress})`;
};

const prepareRevealStagger = () => {
    revealItems.forEach((block) => {
        const children = Array.from(block.children);
        children.forEach((child, index) => {
            child.classList.add("reveal-item");
            child.style.setProperty("--reveal-delay", `${Math.min(index, 7) * 90}ms`);
        });
    });
};

const updateBackgroundDepth = () => {
    if (bgLayers.length === 0) return;
    const scrollY = window.scrollY || 0;
    bgLayers.forEach((layer) => {
        const speed = layer.classList.contains("layer-a") ? 0.12 : layer.classList.contains("layer-b") ? 0.2 : 0.08;
        const drift = layer.classList.contains("layer-b") ? scrollY * 0.02 : scrollY * -0.015;
        const y = scrollY * speed;
        layer.style.transform = `translate3d(${drift}px, ${y}px, 0)`;
    });
};

const getSiteData = () => {
    try {
        return JSON.parse(localStorage.getItem('portfolio_site')) || {};
    } catch {
        return {};
    }
};

const renderQuickStats = (stats = []) => {
    const container = document.getElementById('quickStats');
    if (!container) return;

    const defaultStats = [
        { value: '15+', label: 'UI Components' },
        { value: '8+', label: 'Projects Built' },
        { value: '100%', label: 'Responsive Design' }
    ];

    const items = Array.isArray(stats) && stats.length ? stats : defaultStats;
    container.innerHTML = items
        .map(stat => `<li><strong>${stat.value}</strong><span>${stat.label}</span></li>`)
        .join('');
};

let typingRoles = ["Frontend Developer", "Full Stack Developer", "UI Builder", "Web Designer"];

const applySiteData = (data = getSiteData()) => {

    const brand = document.getElementById('brandName');
    if (brand && data.brand) brand.textContent = data.brand;

    const headline = document.getElementById('heroHeadline');
    if (headline && data.hero?.headline) headline.textContent = data.hero.headline;

    const heroIntro = document.getElementById('heroIntro');
    if (heroIntro && data.hero?.intro) heroIntro.textContent = data.hero.intro;

    const heroOutro = document.getElementById('heroOutro');
    if (heroOutro && data.hero?.outro) heroOutro.textContent = data.hero.outro;

    if (data.hero?.roles && Array.isArray(data.hero.roles) && data.hero.roles.length) {
        typingRoles = data.hero.roles;
        if (!typingRoles.includes("Full Stack Developer")) {
            typingRoles.push("Full Stack Developer");
        }
    }

    renderQuickStats(data.stats);
};

const setupHeroTilt = () => {
    if (!heroPhotoWrap || shouldLimitMotionWork) return;

    const resetTilt = () => {
        heroPhotoWrap.style.setProperty("--hero-rx", "0deg");
        heroPhotoWrap.style.setProperty("--hero-ry", "0deg");
    };

    heroPhotoWrap.addEventListener("pointermove", (event) => {
        const rect = heroPhotoWrap.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width;
        const py = (event.clientY - rect.top) / rect.height;
        const rx = (0.5 - py) * 9;
        const ry = (px - 0.5) * 12;
        heroPhotoWrap.style.setProperty("--hero-rx", `${rx.toFixed(2)}deg`);
        heroPhotoWrap.style.setProperty("--hero-ry", `${ry.toFixed(2)}deg`);
    });

    heroPhotoWrap.addEventListener("pointerleave", resetTilt);
    heroPhotoWrap.addEventListener("pointerup", resetTilt);
};

const setupProjectTilt = () => {
    const cards = getProjectCards();
    if (cards.length === 0 || shouldLimitMotionWork) return;

    cards.forEach((card) => {
        const resetCard = () => {
            card.style.setProperty("--card-rx", "0deg");
            card.style.setProperty("--card-ry", "0deg");
            card.style.setProperty("--card-lift", "0px");
        };

        card.addEventListener("pointermove", (event) => {
            const rect = card.getBoundingClientRect();
            const px = (event.clientX - rect.left) / rect.width;
            const py = (event.clientY - rect.top) / rect.height;
            const rx = (0.5 - py) * 8;
            const ry = (px - 0.5) * 10;
            card.style.setProperty("--card-rx", `${rx.toFixed(2)}deg`);
            card.style.setProperty("--card-ry", `${ry.toFixed(2)}deg`);
            card.style.setProperty("--card-lift", "-6px");
        });

        card.addEventListener("pointerleave", resetCard);
        card.addEventListener("pointerup", resetCard);
    });
};

const updateFieldHint = (fieldId, message = "") => {
    const hint = document.querySelector(`[data-hint-for="${fieldId}"]`);
    if (!hint) return;
    const defaultText = hint.getAttribute("data-default") || "";
    hint.textContent = message || defaultText;
    hint.classList.toggle("error", Boolean(message));
};

const validateNameField = (input, fieldId) => {
    if (!input) return true;
    const value = input.value.trim();
    const valid = /^[A-Za-z][A-Za-z .'-]{1,59}$/.test(value);
    if (!valid) {
        input.setCustomValidity("Use 2-60 characters with letters, spaces, ., ' or -.");
        updateFieldHint(fieldId, input.validationMessage);
        return false;
    }
    input.setCustomValidity("");
    updateFieldHint(fieldId, "");
    return true;
};

if (themeToggle && !document.body.dataset.adminPage) {
    const storedTheme = localStorage.getItem("portfolio-theme");
    if (storedTheme === "light") {
        document.body.classList.add("light");
    }
    setThemeLabel();
    themeToggle.addEventListener("click", () => {
        withThemeTransition(() => {
            document.body.classList.toggle("light");
            localStorage.setItem("portfolio-theme", document.body.classList.contains("light") ? "light" : "dark");
            setThemeLabel();
        });
    });
}

let portfolioRenderPromise = Promise.resolve();
if (isPortfolioPage) {
    portfolioRenderPromise = renderPortfolioContent();
}
setupHeroTilt();

if (rotatePhotoBtn) {
    rotatePhotoBtn.addEventListener('click', () => {
        heroPhotoCard?.classList.toggle('flipped');
    });
}

if (year) {
    year.textContent = new Date().getFullYear();
}

const sitTrigger = document.getElementById("sitTrigger");
const sitParticleLayer = document.getElementById("sitParticleLayer");

const initSitParticles = () => {
    if (!sitTrigger || !sitParticleLayer || shouldLimitMotionWork) return;

    let particleLoopId = 0;
    let burstPlayed = false;

    const spawnParticle = () => {
        const layerRect = sitParticleLayer.getBoundingClientRect();
        if (layerRect.width === 0 || layerRect.height === 0) return;

        const particle = document.createElement("span");
        particle.className = "sit-particle";

        const edgeRoll = Math.random();
        let startX = layerRect.width * (0.18 + Math.random() * 0.64);
        let startY = layerRect.height * (0.66 + Math.random() * 0.22);

        if (edgeRoll < 0.38) {
            startX = layerRect.width * (0.06 + Math.random() * 0.16);
            startY = layerRect.height * (0.34 + Math.random() * 0.48);
        } else if (edgeRoll < 0.76) {
            startX = layerRect.width * (0.78 + Math.random() * 0.16);
            startY = layerRect.height * (0.34 + Math.random() * 0.48);
        }

        const size = 4 + Math.random() * 6;
        const travelY = 42 + Math.random() * 54;
        const driftX = -12 + Math.random() * 24;
        const opacity = 0.42 + Math.random() * 0.24;
        const duration = 2200 + Math.random() * 1500;
        const core = Math.random() > 0.5 ? "rgba(255, 94, 220, 0.92)" : "rgba(179, 96, 255, 0.92)";
        const glow = Math.random() > 0.5 ? "rgba(255, 146, 244, 0.96)" : "rgba(205, 126, 255, 0.94)";

        particle.style.setProperty("--start-x", `${startX.toFixed(2)}px`);
        particle.style.setProperty("--start-y", `${startY.toFixed(2)}px`);
        particle.style.setProperty("--particle-size", `${size.toFixed(2)}px`);
        particle.style.setProperty("--travel-y", `${travelY.toFixed(2)}px`);
        particle.style.setProperty("--drift-x", `${driftX.toFixed(2)}px`);
        particle.style.setProperty("--particle-opacity", opacity.toFixed(2));
        particle.style.setProperty("--particle-duration", `${duration.toFixed(0)}ms`);
        particle.style.setProperty("--particle-core", core);
        particle.style.setProperty("--particle-glow", glow);

        sitParticleLayer.appendChild(particle);
        window.setTimeout(() => particle.remove(), duration + 80);
    };

    const startLoop = () => {
        if (!burstPlayed) {
            burstPlayed = true;
            for (let i = 0; i < 8; i += 1) {
                window.setTimeout(spawnParticle, i * 140);
            }
        }
        if (particleLoopId) return;
        particleLoopId = window.setInterval(() => {
            const burst = 1 + Math.floor(Math.random() * 2);
            for (let i = 0; i < burst; i += 1) {
                window.setTimeout(spawnParticle, i * (120 + Math.random() * 160));
            }
        }, 700);
    };

    const stopLoop = () => {
        if (!particleLoopId) return;
        window.clearInterval(particleLoopId);
        particleLoopId = 0;
    };

    if ("IntersectionObserver" in window) {
        const sitObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    startLoop();
                } else {
                    stopLoop();
                }
            });
        }, { threshold: 0.2 });
        sitObserver.observe(sitTrigger);
    } else {
        startLoop();
    }
};

initSitParticles();

if (sitTrigger) {
    let clicks = 0;
    let resetTimer = 0;

    sitTrigger.addEventListener("click", () => {
        clicks += 1;
        window.clearTimeout(resetTimer);
        resetTimer = window.setTimeout(() => {
            clicks = 0;
        }, 1500);

        if (clicks >= 4) {
            clicks = 0;
            window.location.href = new URL("login.html", window.location.href).toString();
        }
    });
}

if (typingText) {
    let roleIndex = 0;
    let charIndex = 0;
    let deleting = false;
    let typingStopped = false;

    const type = () => {
        if (typingStopped) return;
        if (window.scrollY > 120) {
            typingText.textContent = typingRoles[0];
            typingStopped = true;
            return;
        }

        const current = typingRoles[roleIndex];
        typingText.textContent = current.slice(0, charIndex);

        if (!deleting && charIndex < current.length) {
            charIndex += 1;
            setTimeout(type, 100);
            return;
        }

        if (!deleting && charIndex === current.length) {
            deleting = true;
            setTimeout(type, 1000);
            return;
        }

        if (deleting && charIndex > 0) {
            charIndex -= 1;
            setTimeout(type, 55);
            return;
        }

        deleting = false;
        roleIndex = (roleIndex + 1) % typingRoles.length;
        setTimeout(type, 250);
    };

    portfolioRenderPromise.finally(type);
}

if (revealItems.length > 0) {
    prepareRevealStagger();
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.16 });

    revealItems.forEach((item) => observer.observe(item));
}

if (timelineGroups.length > 0) {
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("timeline-visible");
            timelineObserver.unobserve(entry.target);
        });
    }, { threshold: 0.25 });

    timelineGroups.forEach((timeline) => timelineObserver.observe(timeline));
}

if (skillFilterGroup) {
    skillFilterGroup.addEventListener("click", (event) => {
        const target = event.target.closest(".chip");
        if (!target) return;

        skillFilterGroup.querySelectorAll(".chip").forEach((chip) => chip.classList.remove("active"));
        target.classList.add("active");

        const selected = target.getAttribute("data-filter");
        getSkillCategories().forEach((category) => {
            const match = selected === "all" || category.getAttribute("data-category") === selected;
            category.style.display = match ? "block" : "none";
        });
    });
}

if (certificateFilterGroup) {
    certificateFilterGroup.addEventListener("click", (event) => {
        const target = event.target.closest(".chip");
        if (!target) return;

        certificateFilterGroup.querySelectorAll(".chip").forEach((chip) => chip.classList.remove("active"));
        target.classList.add("active");

        const selected = target.getAttribute("data-filter");
        getCertificateCards().forEach((card) => {
            const match = selected === "all" || card.getAttribute("data-category") === selected;
            card.style.display = match ? "block" : "none";
        });

        // Reset certificate slider to beginning when filtering
        const certificateTrack = document.getElementById("certificateGrid");
        certificateTrack?.scrollTo({ left: 0, behavior: "smooth" });
    });
}

window.addEventListener("storage", (event) => {
    if (!shouldUseBrowserPortfolioData || !isPortfolioPage || !event.key || !event.key.startsWith("portfolio_")) return;
    renderPortfolioContent();
    setupProjectTilt();
});

if (sliderButtons.length > 0) {
    sliderButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const targetId = button.getAttribute("data-target");
            const direction = button.getAttribute("data-dir");
            if (!targetId || !direction) return;

            const track = document.getElementById(targetId);
            if (!track) return;

            const moveBy = Math.max(260, Math.floor(track.clientWidth * 0.85));
            const left = direction === "prev" ? -moveBy : moveBy;
            track.scrollBy({ left, behavior: "smooth" });
        });
    });
}

if (copyEmailBtn) {
    copyEmailBtn.addEventListener("click", async () => {
        const email = copyEmailBtn.getAttribute("data-email");
        if (!email) return;

        try {
            await navigator.clipboard.writeText(email);
            if (copyStatus) copyStatus.textContent = "Email copied to clipboard.";
        } catch (error) {
            if (copyStatus) copyStatus.textContent = "Copy failed. Please copy manually: " + email;
        }
    });
}

if (contactForm) {
    const validateContactEmail = () => {
        if (!contactEmailInput) return true;
        if (contactEmailInput.validity.typeMismatch) {
            contactEmailInput.setCustomValidity("Please enter a valid email address.");
            updateFieldHint("email", contactEmailInput.validationMessage);
            return false;
        }
        contactEmailInput.setCustomValidity("");
        updateFieldHint("email", "");
        return true;
    };

    const validateContactMessage = () => {
        if (!contactMessageInput) return true;
        const length = contactMessageInput.value.trim().length;
        if (length < 20) {
            contactMessageInput.setCustomValidity("Message must be at least 20 characters.");
            updateFieldHint("message", contactMessageInput.validationMessage);
            return false;
        }
        if (length > 1200) {
            contactMessageInput.setCustomValidity("Message must be under 1200 characters.");
            updateFieldHint("message", contactMessageInput.validationMessage);
            return false;
        }
        contactMessageInput.setCustomValidity("");
        updateFieldHint("message", "");
        return true;
    };

    contactNameInput?.addEventListener("input", () => validateNameField(contactNameInput, "name"));
    contactEmailInput?.addEventListener("input", validateContactEmail);
    contactMessageInput?.addEventListener("input", validateContactMessage);

    contactForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const hint = contactForm.querySelector(".form-hint");
        const contactValid = validateNameField(contactNameInput, "name")
            && validateContactEmail()
            && validateContactMessage()
            && contactForm.reportValidity();

        if (!contactValid) {
            if (hint) hint.textContent = "Please fix the highlighted fields and try again.";
            return;
        }

        if (hint) hint.textContent = "Sending message...";

        try {
            const formData = new FormData(contactForm);
            const response = await fetch("https://formsubmit.co/ajax/chandra170905@gmail.com", {
                method: "POST",
                headers: { Accept: "application/json" },
                body: formData
            });

            if (response.ok) {
                window.location.href = new URL("thanks.html", window.location.href).toString();
                return;
            }

            if (hint) {
                hint.textContent = "Send failed. If this is first use, verify FormSubmit email once and try again.";
            }
        } catch (error) {
            if (hint) hint.textContent = "Network error. Please try again.";
        }
    });
}

const openHireModal = () => {
    if (!hireModal) return;
    hireModal.classList.add("show");
    hireModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    const nameField = document.getElementById("hireName");
    const emailField = document.getElementById("hireEmail");
    const detailsField = document.getElementById("hireDetails");
    const contactName = document.getElementById("name");
    const contactEmail = document.getElementById("email");
    const contactMessage = document.getElementById("message");

    if (nameField && contactName instanceof HTMLInputElement && !nameField.value) {
        nameField.value = contactName.value;
    }
    if (emailField && contactEmail instanceof HTMLInputElement && !emailField.value) {
        emailField.value = contactEmail.value;
    }
    if (detailsField && contactMessage instanceof HTMLTextAreaElement && !detailsField.value) {
        detailsField.value = contactMessage.value;
    }

    const firstField = hireModal.querySelector("input, select, textarea");
    if (firstField instanceof HTMLElement) firstField.focus();
};

const closeHireModal = () => {
    if (!hireModal) return;
    hireModal.classList.remove("show");
    hireModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (hireToast) hireToast.classList.remove("show");
};

if (hireMeBtn) {
    hireMeBtn.addEventListener("click", openHireModal);
}

if (hireModal) {
    hireModal.addEventListener("click", (event) => {
        const target = event.target;
        if (target instanceof HTMLElement && target.hasAttribute("data-modal-close")) {
            closeHireModal();
        }
    });
}

window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && hireModal?.classList.contains("show")) {
        closeHireModal();
    }
});

if (hireForm) {
    const marketConfigs = {
        india: {
            currency: "INR",
            phonePattern: "^[6-9][0-9]{9}$",
            phonePlaceholder: "10-digit mobile number",
            phoneMessage: "Enter a valid 10-digit Indian mobile number (starts with 6-9).",
            budgetMin: 1000,
            budgetStep: 100,
            budgetPlaceholder: "e.g. 15000",
            budgetMessage: "Enter your estimated budget in INR.",
            ranges: [
                { value: "under_10000", label: "Under INR 10,000", amount: 8000 },
                { value: "10000_30000", label: "INR 10,000 - 30,000", amount: 20000 },
                { value: "30000_70000", label: "INR 30,000 - 70,000", amount: 45000 },
                { value: "70000_150000", label: "INR 70,000 - 1,50,000", amount: 90000 },
                { value: "150000_plus", label: "INR 1,50,000+", amount: 180000 }
            ]
        },
        international: {
            currency: "USD",
            phonePattern: "^\\+?[1-9][0-9]{7,14}$",
            phonePlaceholder: "+1 5551234567",
            phoneMessage: "Use international format with country code (8-15 digits, optional +).",
            budgetMin: 50,
            budgetStep: 10,
            budgetPlaceholder: "e.g. 500",
            budgetMessage: "Enter your estimated budget in USD.",
            ranges: [
                { value: "under_200", label: "Under $200", amount: 150 },
                { value: "200_500", label: "$200 - $500", amount: 350 },
                { value: "500_1000", label: "$500 - $1,000", amount: 750 },
                { value: "1000_2000", label: "$1,000 - $2,000", amount: 1500 },
                { value: "2000_plus", label: "$2,000+", amount: 2500 }
            ]
        }
    };

    const getSelectedMarket = () => {
        if (!hireMarket?.value) return "india";
        return hireMarket.value === "international" ? "international" : "india";
    };

    const setHireRangeOptions = (market) => {
        if (!hireRange) return;
        const config = marketConfigs[market];
        hireRange.innerHTML = '<option value="" disabled selected>Select a range</option>';
        config.ranges.forEach((item) => {
            const option = document.createElement("option");
            option.value = item.value;
            option.textContent = item.label;
            option.dataset.amount = String(item.amount);
            hireRange.appendChild(option);
        });
    };

    const applyMarketConstraints = (market) => {
        const config = marketConfigs[market];
        if (!config) return;

        if (hireCurrency) hireCurrency.textContent = config.currency;
        if (hirePhone) {
            hirePhone.pattern = config.phonePattern;
            hirePhone.placeholder = config.phonePlaceholder;
            hirePhone.setCustomValidity("");
            updateFieldHint("hirePhone", config.phoneMessage);
        }
        if (hireBudget) {
            hireBudget.min = String(config.budgetMin);
            hireBudget.step = String(config.budgetStep);
            hireBudget.placeholder = config.budgetPlaceholder;
            hireBudget.setCustomValidity("");
            updateFieldHint("hireBudget", config.budgetMessage);
        }
        setHireRangeOptions(market);
        if (hireRange) hireRange.setCustomValidity("");
    };

    const validateHireMarket = () => {
        if (!hireMarket) return true;
        if (!hireMarket.value) {
            hireMarket.setCustomValidity("Please choose India or International.");
            updateFieldHint("hireMarket", hireMarket.validationMessage);
            return false;
        }
        hireMarket.setCustomValidity("");
        updateFieldHint("hireMarket", "");
        return true;
    };

    const validateHirePhone = () => {
        if (!hirePhone) return true;
        const market = getSelectedMarket();
        if (hirePhone.validity.patternMismatch) {
            hirePhone.setCustomValidity(marketConfigs[market].phoneMessage);
            updateFieldHint("hirePhone", hirePhone.validationMessage);
            return false;
        }
        hirePhone.setCustomValidity("");
        updateFieldHint("hirePhone", "");
        return true;
    };

    const validateHireBudget = () => {
        if (!hireBudget) return true;
        const market = getSelectedMarket();
        const amount = Number(hireBudget.value);
        const minBudget = marketConfigs[market].budgetMin;

        if (hireBudget.value && (Number.isNaN(amount) || amount < minBudget)) {
            hireBudget.setCustomValidity(`Minimum budget for ${marketConfigs[market].currency} is ${minBudget}.`);
            updateFieldHint("hireBudget", hireBudget.validationMessage);
            return false;
        }
        hireBudget.setCustomValidity("");
        updateFieldHint("hireBudget", "");
        return true;
    };

    hireMarket?.addEventListener("change", () => {
        const market = getSelectedMarket();
        applyMarketConstraints(market);
        validateHireMarket();
        if (hireBudget) hireBudget.value = "";
    });

    hirePhone?.addEventListener("input", validateHirePhone);
    hireBudget?.addEventListener("input", validateHireBudget);
    hireName?.addEventListener("input", () => validateNameField(hireName, "hireName"));

    if (hireRange && hireBudget) {
        hireRange.addEventListener("change", () => {
            const selectedOption = hireRange.options[hireRange.selectedIndex];
            if (selectedOption && selectedOption.dataset.amount && !hireBudget.value) {
                hireBudget.value = selectedOption.dataset.amount;
                hireBudget.dispatchEvent(new Event("input", { bubbles: true }));
            }
        });
    }

    applyMarketConstraints(getSelectedMarket());

    hireForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const hireValid = validateNameField(hireName, "hireName")
            && validateHireMarket()
            && validateHirePhone()
            && validateHireBudget()
            && hireForm.reportValidity();
        if (!hireValid) {
            if (hireFormHint) hireFormHint.textContent = "Please fix the highlighted fields and try again.";
            return;
        }
        if (hireFormHint) hireFormHint.textContent = "Sending request...";

        try {
            const formData = new FormData(hireForm);
            const response = await fetch("https://formsubmit.co/ajax/chandra170905@gmail.com", {
                method: "POST",
                headers: { Accept: "application/json" },
                body: formData
            });

            if (response.ok) {
                if (hireToast) hireToast.classList.add("show");
                if (hireFormHint) hireFormHint.textContent = "Request sent successfully.";
                setTimeout(() => {
                    window.location.href = new URL("thanks.html", window.location.href).toString();
                }, 1200);
                return;
            }

            if (hireFormHint) {
                hireFormHint.textContent = "Send failed. If this is first use, verify FormSubmit email once and try again.";
            }
        } catch (error) {
            if (hireFormHint) hireFormHint.textContent = "Network error. Please try again.";
        }
    });
}


const sections = document.querySelectorAll("main section[id]");
let activeSectionId = "";
let ticking = false;

const updateActiveLink = () => {
    const scrollY = window.scrollY + 120;
    let nextActiveId = "";

    sections.forEach((section) => {
        const top = section.offsetTop;
        const bottom = top + section.offsetHeight;
        const id = section.getAttribute("id");
        if (scrollY >= top && scrollY < bottom) {
            nextActiveId = id || "";
        }
    });

    if (!nextActiveId || nextActiveId === activeSectionId) return;

    activeSectionId = nextActiveId;
    document.querySelectorAll(".nav a").forEach((a) => a.classList.remove("active"));
    const link = document.querySelector(`.nav a[href="#${activeSectionId}"]`);
    link?.classList.add("active");
};

window.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
        updateActiveLink();
        updateScrollProgress();
        if (!shouldLimitMotionWork) updateBackgroundDepth();
        ticking = false;
    });
}, { passive: true });
window.addEventListener("load", () => {
    updateActiveLink();
    updateScrollProgress();
    if (!shouldLimitMotionWork) updateBackgroundDepth();
});
window.addEventListener("resize", () => {
    updateScrollProgress();
    if (!shouldLimitMotionWork) updateBackgroundDepth();
});
