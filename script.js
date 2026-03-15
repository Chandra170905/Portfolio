document.documentElement.classList.add("js");

const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");
const navLinks = document.querySelectorAll(".nav a[href^='#']");
const themeToggle = document.getElementById("themeToggle");
const year = document.getElementById("year");
const typingText = document.getElementById("typingText");
const revealItems = document.querySelectorAll(".reveal");
const timelineGroups = document.querySelectorAll(".timeline");
const filterGroup = document.getElementById("projectFilters");
const cards = document.querySelectorAll(".project-card");
const skillFilterGroup = document.getElementById("skillFilters");
const skillCategories = document.querySelectorAll(".skill-category");
const certificateFilterGroup = document.getElementById("certificateFilters");
const certificateCards = document.querySelectorAll(".cert-card");
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
    themeToggle.textContent = document.body.classList.contains("light") ? "Light" : "Dark";
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

const applySiteData = () => {
    const data = getSiteData();

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
    if (!heroPhotoWrap || prefersReducedMotion) return;

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
    if (cards.length === 0 || prefersReducedMotion) return;

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

if (themeToggle) {
    const storedTheme = localStorage.getItem("portfolio-theme");
    if (storedTheme === "light") {
        document.body.classList.add("light");
    }
    setThemeLabel();
    themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("light");
        localStorage.setItem("portfolio-theme", document.body.classList.contains("light") ? "light" : "dark");
        setThemeLabel();
    });
}

setupHeroTilt();
setupProjectTilt();
applySiteData();

if (rotatePhotoBtn) {
    rotatePhotoBtn.addEventListener('click', () => {
        heroPhotoCard?.classList.toggle('flipped');
    });
}

if (year) {
    year.textContent = new Date().getFullYear();
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

    type();
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

if (filterGroup) {
    filterGroup.addEventListener("click", (event) => {
        const target = event.target.closest(".chip");
        if (!target) return;

        filterGroup.querySelectorAll(".chip").forEach((chip) => chip.classList.remove("active"));
        target.classList.add("active");

        const selected = target.getAttribute("data-filter");
        cards.forEach((card) => {
            const match = selected === "all" || card.getAttribute("data-category") === selected;
            card.style.display = match ? "block" : "none";
        });

        const projectTrack = document.getElementById("projectGrid");
        projectTrack?.scrollTo({ left: 0, behavior: "smooth" });
    });
}

if (skillFilterGroup) {
    skillFilterGroup.addEventListener("click", (event) => {
        const target = event.target.closest(".chip");
        if (!target) return;

        skillFilterGroup.querySelectorAll(".chip").forEach((chip) => chip.classList.remove("active"));
        target.classList.add("active");

        const selected = target.getAttribute("data-filter");
        skillCategories.forEach((category) => {
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
        certificateCards.forEach((card) => {
            const match = selected === "all" || card.getAttribute("data-category") === selected;
            card.style.display = match ? "block" : "none";
        });

        // Reset certificate slider to beginning when filtering
        const certificateTrack = document.getElementById("certificateGrid");
        certificateTrack?.scrollTo({ left: 0, behavior: "smooth" });
    });
}

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
        updateBackgroundDepth();
        ticking = false;
    });
}, { passive: true });
window.addEventListener("load", () => {
    updateActiveLink();
    updateScrollProgress();
    updateBackgroundDepth();
});
window.addEventListener("resize", () => {
    updateScrollProgress();
    updateBackgroundDepth();
});
