document.documentElement.classList.add("js");

const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");
const navLinks = document.querySelectorAll(".nav a[href^='#']");
const themeToggle = document.getElementById("themeToggle");
const year = document.getElementById("year");
const typingText = document.getElementById("typingText");
const revealItems = document.querySelectorAll(".reveal");
const filterGroup = document.getElementById("projectFilters");
const cards = document.querySelectorAll(".project-card");
const sliderButtons = document.querySelectorAll(".slider-btn");
const copyEmailBtn = document.getElementById("copyEmailBtn");
const copyStatus = document.getElementById("copyStatus");
const contactForm = document.getElementById("contactForm");
const hireMeBtn = document.getElementById("hireMeBtn");
const hireModal = document.getElementById("hireModal");
const hireForm = document.getElementById("hireForm");
const hireFormHint = document.getElementById("hireFormHint");
const hirePhone = document.getElementById("hirePhone");
const hireBudget = document.getElementById("hireBudget");
const hireRange = document.getElementById("hireRange");
const hireToast = document.getElementById("hireToast");

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

if (year) {
    year.textContent = new Date().getFullYear();
}

if (typingText) {
    const roles = ["Frontend Developer", "UI Builder", "Web Designer"];
    let roleIndex = 0;
    let charIndex = 0;
    let deleting = false;
    let typingStopped = false;

    const type = () => {
        if (typingStopped) return;
        if (window.scrollY > 120) {
            typingText.textContent = roles[0];
            typingStopped = true;
            return;
        }

        const current = roles[roleIndex];
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
        roleIndex = (roleIndex + 1) % roles.length;
        setTimeout(type, 250);
    };

    type();
}

if (revealItems.length > 0) {
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

if (filterGroup) {
    filterGroup.addEventListener("click", (event) => {
        const target = event.target.closest(".chip");
        if (!target) return;

        document.querySelectorAll(".chip").forEach((chip) => chip.classList.remove("active"));
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
    contactForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const hint = contactForm.querySelector(".form-hint");
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
    const applyHint = (field, message = "") => {
        const hint = document.querySelector(`[data-hint-for="${field.id}"]`);
        if (!hint) return;
        const defaultText = hint.getAttribute("data-default") || "";
        hint.textContent = message || defaultText;
        hint.classList.toggle("error", Boolean(message));
    };

    if (hirePhone) {
        hirePhone.addEventListener("input", () => {
            if (hirePhone.validity.patternMismatch) {
                hirePhone.setCustomValidity("Please use digits, spaces, +, or dashes.");
                applyHint(hirePhone, hirePhone.validationMessage);
            } else {
                hirePhone.setCustomValidity("");
                applyHint(hirePhone, "");
            }
        });
    }

    if (hireBudget) {
        hireBudget.addEventListener("input", () => {
            if (hireBudget.value && Number(hireBudget.value) <= 0) {
                hireBudget.setCustomValidity("Budget must be greater than 0.");
                applyHint(hireBudget, hireBudget.validationMessage);
            } else {
                hireBudget.setCustomValidity("");
                applyHint(hireBudget, "");
            }
        });
    }

    if (hireRange && hireBudget) {
        hireRange.addEventListener("change", () => {
            const map = {
                under_200: 150,
                200_500: 350,
                500_1000: 750,
                1000_2000: 1500,
                "2000_plus": 2500
            };
            const next = map[hireRange.value];
            if (next && !hireBudget.value) {
                hireBudget.value = String(next);
                hireBudget.dispatchEvent(new Event("input", { bubbles: true }));
            }
        });
    }

    hireForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        if (!hireForm.reportValidity()) return;
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
        ticking = false;
    });
}, { passive: true });
window.addEventListener("load", updateActiveLink);
